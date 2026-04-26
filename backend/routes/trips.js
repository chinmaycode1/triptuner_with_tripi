const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// GET /api/trips
router.get('/', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ trips: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trips - Save PDF to storage and URL to database
router.post('/', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  
  try {
    console.log('Saving trip PDF for user:', req.user.id);
    
    const { destination, pdfBlob, filename } = req.body;
    
    if (!destination || !pdfBlob || !filename) {
      return res.status(400).json({ error: 'destination, pdfBlob, and filename are required' });
    }

    // Convert base64 PDF blob to buffer
    const pdfBuffer = Buffer.from(pdfBlob, 'base64');
    
    // Upload PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trip-pdfs')
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('trip-pdfs')
      .getPublicUrl(filename);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    // Save simple record to database
    const { data, error } = await supabase
      .from('saved_trips')
      .insert({
        user_id: req.user.id,
        destination: destination,
        pdf_url: urlData.publicUrl
      })
      .select()
      .single();
      
    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }
    
    console.log('Trip saved successfully:', data);

    res.status(201).json({ 
      trip: data,
      message: 'Trip saved and PDF stored successfully!'
    });
  } catch (err) {
    console.error('Error saving trip:', err);
    res.status(500).json({ 
      error: err.message,
      details: err.details || 'Unknown error'
    });
  }
});

// DELETE /api/trips/:id - Delete from database and storage
router.delete('/:id', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  try {
    // First get the trip to find the PDF filename
    const { data: trip, error: fetchError } = await supabase
      .from('saved_trips')
      .select('pdf_url')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;

    // Extract filename from URL
    const filename = trip.pdf_url.split('/').pop();

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('trip-pdfs')
      .remove([filename]);

    if (storageError) {
      console.warn('Storage delete warning:', storageError);
      // Continue even if storage delete fails
    }

    // Delete from database
    const { error } = await supabase
      .from('saved_trips')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

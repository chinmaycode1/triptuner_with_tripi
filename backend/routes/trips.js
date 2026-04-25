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

// POST /api/trips
router.post('/', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  try {
    const tripData = {
      user_id: req.user.id,
      destination: req.body.destination,
      state: req.body.state,
      itinerary_text: req.body.itinerary_text,
      itinerary_json: req.body.itinerary_json,
      duration_days: req.body.duration_days,
      budget_total: req.body.budget_total,
      budget_per_person: req.body.budget_per_person,
      group_size: req.body.group_size,
      trip_type: req.body.trip_type,
      travel_style: req.body.travel_style,
      transport_mode: req.body.transport_mode,
      accommodation_type: req.body.accommodation_type,
      season: req.body.season,
      interests: req.body.interests,
    };
    const { data, error } = await supabase.from('saved_trips').insert(tripData).select().single();
    if (error) throw error;

    // Increment total_trips_planned
    await supabase.rpc('increment_trips_count', { user_id: req.user.id }).catch(() => {});

    res.status(201).json({ trip: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  try {
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

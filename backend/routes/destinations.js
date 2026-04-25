const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const { category, state, region, budget_max, featured } = req.query;
    let query = supabase.from('destinations').select('*');

    if (category) query = query.contains('category', [category]);
    if (state) query = query.eq('state', state);
    if (region) query = query.eq('region', region);
    if (budget_max) query = query.lte('avg_budget_per_day', Number(budget_max));
    if (featured === 'true') query = query.eq('is_featured', true);

    query = query.order('name');
    const { data, error } = await query;
    if (error) throw error;
    res.json({ destinations: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

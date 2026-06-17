const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://apzlfwmgkyffftwvpqyr.supabase.co',
  'sb_secret_GQFbPtMZLo2mg3ExIBv3LA_P2TFByLx'
);

async function inspect() {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

inspect();

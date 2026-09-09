const url = 'https://judycrzfkrpkvtjdzphq.supabase.co/rest/v1/resources?select=id,title,type,category,created_at&order=created_at.desc&limit=10';
fetch(url, { headers: { 'apikey': 'sb_publishable_GiwPxUmVlx-QIwtGioL6Eg_cW4Q85zQ' } })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);

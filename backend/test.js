cat > test.js << 'EOF'
const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'working' });
});

app.listen(5000, () => {
  console.log('Server on 5000');
});

setTimeout(() => {
  console.log('Server still running...');
}, 2000);
EOF
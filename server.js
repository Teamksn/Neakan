const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server កំពុងដំណើរការលើ Port ${PORT}`);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

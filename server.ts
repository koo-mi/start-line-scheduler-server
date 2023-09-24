import app from "./utils/app";

const PORT = process.env.PORT || "5050";

/* LISTEN */
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

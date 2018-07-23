import app from './app';
import db from './models';

const port = process.env.PORT || 4000;

db.sequelize.sync({ force: true });

app.listen(port, () => {
  console.log(`App running on ${port}`); // eslint-disable-line
});

const mongoose = require('mongoose');

// Counter schema to track sequence
const counterSchema = new mongoose.Schema({
  model: { type: String, required: true },
  field: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(model, field, incrementBy = 1) {
  const counter = await Counter.findOneAndUpdate(
    { model, field },
    { $inc: { count: incrementBy } },
    { new: true, upsert: true }
  );
  return counter.count;
}

// Auto-increment plugin
function autoIncrementPlugin(schema, options) {
  const { field, model } = options;

  // Add the auto-increment field to the schema
  schema.add({ [field]: { type: Number, unique: true } });

  // Pre-save for single document inserts
  schema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
      this[field] = await getNextSequence(model, field);
      next();
    } catch (err) {
      next(err);
    }
  });

  // Middleware to handle bulk insert (insertMany)
  schema.pre('insertMany', async function (next, docs) {
    try {
      const incrementBy = docs.length;
      const startCount = await getNextSequence(model, field, incrementBy);

      docs.forEach((doc, index) => {
        doc[field] = startCount - incrementBy + 1 + index;
      });

      next();
    } catch (err) {
      next(err);
    }
  });
}

module.exports = autoIncrementPlugin;
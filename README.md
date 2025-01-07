# Mongoose Auto-Increment Plugin

This is a Mongoose plugin for auto-incrementing field values in MongoDB documents. It provides automatic sequence generation for specified fields, such as generating unique IDs or other sequential values. The plugin works by maintaining a counter in a separate `Counter` collection and increments the value as needed.

## Features

- Automatically increments a field value for each new document.
- Supports both single document inserts and bulk inserts (`insertMany`).
- Configurable to track sequences for different models and fields.
- Uses a `Counter` schema to track the current value of the sequence.

## Installation

Install the plugin via npm:

```bash
npm install @inxeoz/auto-increment

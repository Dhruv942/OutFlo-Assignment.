"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
const mongoose_1 = require("mongoose");
const campaignSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'inactive' },
    leads: [String],
    accountIDs: [String],
}, { timestamps: true });
exports.Campaign = (0, mongoose_1.model)('Campaign', campaignSchema);

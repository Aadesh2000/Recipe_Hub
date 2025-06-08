// Measurement units and their conversions
const UNITS = {
    // Volume units (in ml)
    volume: {
        ml: 1,
        l: 1000,
        tsp: 4.93,
        tbsp: 14.79,
        floz: 29.57,
        cup: 236.59,
        pint: 473.18,
        quart: 946.35,
        gallon: 3785.41
    },
    // Weight units (in grams)
    weight: {
        g: 1,
        kg: 1000,
        oz: 28.35,
        lb: 453.59
    },
    // Count units
    count: {
        whole: 1,
        piece: 1,
        slice: 1
    }
};

// Common ingredient densities (g/ml)
const DENSITIES = {
    'flour': 0.593,
    'sugar': 0.845,
    'salt': 1.217,
    'butter': 0.911,
    'oil': 0.92,
    'water': 1,
    'milk': 1.03,
    'honey': 1.42
};

// Regular expressions for parsing ingredient strings
const PATTERNS = {
    // Matches: "2 1/2 cups flour" or "1.5 tsp salt"
    quantity: /^(\d+(?:\s*\d*\/\d*)?|\d*\.\d+)\s*/,
    // Matches: "cups", "tablespoons", "grams", etc.
    unit: /\s*(ml|l|tsp|tbsp|floz|cup|pint|quart|gallon|g|kg|oz|lb|whole|piece|slice)\b/i,
    // Matches: "of" or "of the"
    of: /\s*(?:of(?:\s+the)?\s+)?/i,
    // Matches: ingredient name and any additional notes
    ingredient: /(.+?)(?:\s*,\s*(.+))?$/
};

class MeasurementConverter {
    static parseIngredient(ingredientString) {
        const result = {
            original: ingredientString,
            quantity: null,
            unit: null,
            ingredient: null,
            notes: null
        };

        // Extract quantity
        const quantityMatch = ingredientString.match(PATTERNS.quantity);
        if (quantityMatch) {
            result.quantity = this.parseFraction(quantityMatch[1]);
            ingredientString = ingredientString.slice(quantityMatch[0].length);
        }

        // Extract unit
        const unitMatch = ingredientString.match(PATTERNS.unit);
        if (unitMatch) {
            result.unit = unitMatch[1].toLowerCase();
            ingredientString = ingredientString.slice(unitMatch[0].length);
        }

        // Remove "of" or "of the"
        ingredientString = ingredientString.replace(PATTERNS.of, '');

        // Extract ingredient name and notes
        const ingredientMatch = ingredientString.match(PATTERNS.ingredient);
        if (ingredientMatch) {
            result.ingredient = ingredientMatch[1].trim();
            if (ingredientMatch[2]) {
                result.notes = ingredientMatch[2].trim();
            }
        }

        return result;
    }

    static parseFraction(fractionString) {
        if (fractionString.includes('/')) {
            const [whole, fraction] = fractionString.split(/\s+/);
            if (fraction) {
                const [numerator, denominator] = fraction.split('/');
                return parseFloat(whole) + (parseFloat(numerator) / parseFloat(denominator));
            }
            const [numerator, denominator] = whole.split('/');
            return parseFloat(numerator) / parseFloat(denominator);
        }
        return parseFloat(fractionString);
    }

    static convertUnit(value, fromUnit, toUnit) {
        // Handle count units
        if (UNITS.count[fromUnit] && UNITS.count[toUnit]) {
            return value;
        }

        // Convert to base unit (ml for volume, g for weight)
        let baseValue;
        if (UNITS.volume[fromUnit]) {
            baseValue = value * UNITS.volume[fromUnit];
            return baseValue / UNITS.volume[toUnit];
        } else if (UNITS.weight[fromUnit]) {
            baseValue = value * UNITS.weight[fromUnit];
            return baseValue / UNITS.weight[toUnit];
        }

        throw new Error(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
    }

    static formatQuantity(quantity) {
        if (Number.isInteger(quantity)) {
            return quantity.toString();
        }

        // Convert to fraction if it's a simple fraction
        const tolerance = 0.001;
        for (let denominator = 2; denominator <= 16; denominator++) {
            for (let numerator = 1; numerator < denominator; numerator++) {
                const fraction = numerator / denominator;
                if (Math.abs(quantity - fraction) < tolerance) {
                    return `${numerator}/${denominator}`;
                }
            }
        }

        // Otherwise return as decimal with 2 decimal places
        return quantity.toFixed(2);
    }

    static scaleIngredient(ingredientString, scaleFactor) {
        const parsed = this.parseIngredient(ingredientString);
        if (!parsed.quantity) {
            return ingredientString;
        }

        const scaledQuantity = parsed.quantity * scaleFactor;
        const formattedQuantity = this.formatQuantity(scaledQuantity);
        
        let result = formattedQuantity;
        if (parsed.unit) {
            result += ` ${parsed.unit}`;
        }
        if (parsed.ingredient) {
            result += ` ${parsed.ingredient}`;
        }
        if (parsed.notes) {
            result += `, ${parsed.notes}`;
        }

        return result;
    }

    static getUnitType(unit) {
        if (UNITS.volume[unit]) return 'volume';
        if (UNITS.weight[unit]) return 'weight';
        if (UNITS.count[unit]) return 'count';
        return null;
    }

    static getDensity(ingredient) {
        const normalizedIngredient = ingredient.toLowerCase().trim();
        return DENSITIES[normalizedIngredient] || null;
    }

    static convertBetweenVolumeAndWeight(value, fromUnit, toUnit, ingredient) {
        const density = this.getDensity(ingredient);
        if (!density) {
            throw new Error(`No density information available for ${ingredient}`);
        }

        if (UNITS.volume[fromUnit] && UNITS.weight[toUnit]) {
            // Volume to weight
            const ml = value * UNITS.volume[fromUnit];
            const grams = ml * density;
            return grams / UNITS.weight[toUnit];
        } else if (UNITS.weight[fromUnit] && UNITS.volume[toUnit]) {
            // Weight to volume
            const grams = value * UNITS.weight[fromUnit];
            const ml = grams / density;
            return ml / UNITS.volume[toUnit];
        }

        throw new Error(`Invalid conversion between ${fromUnit} and ${toUnit}`);
    }
}

export default MeasurementConverter; 
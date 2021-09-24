'use strict';
/**
 * Created by steve on 1/10/2017.
 */

export default class GTIN {
    static CHUMS = '000298';
    static CHISCO = '093039';
    static BEYONDCOASTAL = '';

    static raw (upc) {
        let re = /[0-9]/;
        return upc.split('')
            .filter(c => re.test(c))
            .join('');
    }

    static format(gtin = '', autoCheckDigit = true) {
        if (!gtin) {
            return '';
        }
        return /^45[0-9]/.test(gtin) // for Japan barcodes
            ? GTIN.formatEAN13(gtin, gtin.length === 13)
            : GTIN.formatUPC(gtin, gtin.length === 12);
    }

    static toString(gtin) {
        return /^45[0-9]/.test(gtin) // for Japan barcodes
            ? (gtin.length === 13 ? gtin : gtin + GTIN.checkdigit(gtin))
            : (gtin.length === 12 ? gtin : gtin + GTIN.checkdigit(gtin));
    }

    static formatUPC(gtin, autoCheckDigit = true) {
        if (typeof gtin !== "string") {
            return gtin;
        }

        gtin = gtin.replace(/\D/g, '').replace(/\s/g, '');

        if (gtin.length > 2 && gtin.substr(0, 2) === '45') {
            return GTIN.formatEAN13(gtin, autoCheckDigit);
        }

        if (gtin.length > 12) {
            return gtin;
        }

        if (gtin.length < 11 && autoCheckDigit) {
            autoCheckDigit = false;
        }

        return gtin.substr(0, 1)
            + (gtin.length > 1 ? ' ' : '')
            + gtin.substr(1, 5)
            + (gtin.length > 6 ? ' ' : '')
            + gtin.substr(6, 5)
            + (autoCheckDigit ? ' ' + GTIN.checkdigit(gtin.substr(0, 11)) : '');
    }

    static formatEAN13(gtin, autoCheckDigit = true) {
        if (typeof gtin !== "string") {
            return gtin;
        }

        gtin = gtin.replace(/\D/g, '').replace(/\s/g, '');

        if (gtin.length > 13) {
            return gtin;
        }

        if (gtin.length < 12 && autoCheckDigit) {
            autoCheckDigit = false;
        }

        return gtin.substr(0, 1)
            + (gtin.length > 1 ? ' ' : '')
            + gtin.substr(1, 6)
            + (gtin.length > 7 ? ' ' : '')
            + gtin.substr(7, 5)
            + (autoCheckDigit ? GTIN.checkdigit(gtin.substr(0, 12)) : '');
    }

    static checkdigit(gtin) {
        if (typeof gtin !== "string") {
            console.log('GTIN.checkdigit() GTIN must be a string', gtin);
            return gtin;
        }
        gtin = GTIN.raw(gtin.trim());

        if (gtin.length < 11) {
            // console.log('UPCA.checkdigit() UPC is too short', upc);
            return '';
        }

        let cd = {
            even: 0,
            odd: 0
        };
        gtin.split('').reverse().map((c, index) => {
            let parsed = parseInt(c, 10);
            if (index % 2 === 0) {
                cd.even += parsed;
            } else {
                cd.odd += parsed;
            }
        });
        cd.even *= 3;
        return (10 - (cd.odd + cd.even) % 10) % 10;
    }
}

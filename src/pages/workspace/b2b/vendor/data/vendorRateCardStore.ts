import { VendorTradeRateCard } from '../../cost/data/estimateTypes';
import { MOCK_VENDOR_RATE_CARDS } from '../../cost/data/mockEstimateData';

const LOCAL_STORAGE_KEY = 'arqon_vendor_rate_cards_v1';

export interface RateCardItem {
  itemKey: string;
  description: string;
  unit: 'Sq.ft.' | 'R.ft.' | 'No.' | 'Nos' | 'L/S' | 'Set' | string;
  standardRate: number;
  preferredRate: number;
  specRemarks?: string;
}

export function getStoredVendorRateCards(): VendorTradeRateCard[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading vendor rate cards from storage', e);
  }
  return MOCK_VENDOR_RATE_CARDS;
}

export function saveVendorRateCards(cards: VendorTradeRateCard[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
    // Dispatch a custom event so other components / tabs can react immediately
    window.dispatchEvent(new CustomEvent('arqon_rate_cards_updated', { detail: cards }));
  } catch (e) {
    console.error('Error saving vendor rate cards', e);
  }
}

export function addRateCardItemToVendor(
  vendorIdOrTradeCode: string,
  newItem: RateCardItem,
  vendorInfoFallback?: { vendorName: string; tradeCategory: string; tradeCode: any }
): VendorTradeRateCard[] {
  const currentCards = getStoredVendorRateCards();
  let found = false;

  const updatedCards = currentCards.map(card => {
    if (card.vendorId === vendorIdOrTradeCode || card.tradeCode === vendorIdOrTradeCode) {
      found = true;
      // check if itemKey exists
      const existingIdx = card.rates.findIndex(r => r.itemKey === newItem.itemKey);
      let updatedRates = [...card.rates];
      if (existingIdx >= 0) {
        updatedRates[existingIdx] = newItem as any;
      } else {
        updatedRates.push(newItem as any);
      }
      return {
        ...card,
        rates: updatedRates
      };
    }
    return card;
  });

  if (!found && vendorInfoFallback) {
    const newCard: VendorTradeRateCard = {
      vendorId: vendorIdOrTradeCode,
      vendorName: vendorInfoFallback.vendorName,
      tradeCategory: vendorInfoFallback.tradeCategory,
      tradeCode: vendorInfoFallback.tradeCode,
      rates: [newItem as any]
    };
    updatedCards.push(newCard);
  }

  saveVendorRateCards(updatedCards);
  return updatedCards;
}

export function updateRateCardItem(
  vendorId: string,
  itemKey: string,
  updatedFields: Partial<RateCardItem>
): VendorTradeRateCard[] {
  const currentCards = getStoredVendorRateCards();
  const updatedCards = currentCards.map(card => {
    if (card.vendorId === vendorId) {
      return {
        ...card,
        rates: card.rates.map(r => {
          if (r.itemKey === itemKey) {
            return {
              ...r,
              ...updatedFields
            };
          }
          return r;
        })
      };
    }
    return card;
  });

  saveVendorRateCards(updatedCards);
  return updatedCards;
}

export function deleteRateCardItem(vendorId: string, itemKey: string): VendorTradeRateCard[] {
  const currentCards = getStoredVendorRateCards();
  const updatedCards = currentCards.map(card => {
    if (card.vendorId === vendorId) {
      return {
        ...card,
        rates: card.rates.filter(r => r.itemKey !== itemKey)
      };
    }
    return card;
  });

  saveVendorRateCards(updatedCards);
  return updatedCards;
}

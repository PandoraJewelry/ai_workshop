import { useState, useEffect } from 'react';
import type {
  Product,
  CartItem,
  CustomizationConfig,
  CustomizationSelection,
  CustomizationOptionValue,
  PriceBreakdown,
  CustomizationSummaryItem,
} from '../../../types';
import {
  getConfig,
  calculatePrice,
  validateStep,
  formatSummary,
  generateCustomizationId,
  formatPrice,
  formatPriceModifier,
} from '../../../services';

interface CustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const steps = [
  { number: 1, label: 'Size' },
  { number: 2, label: 'Options' },
  { number: 3, label: 'Gift Note' },
  { number: 4, label: 'Summary' },
];

export function CustomizationModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: CustomizationModalProps) {
  const [config, setConfig] = useState<CustomizationConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, CustomizationSelection>>({});
  const [priceInfo, setPriceInfo] = useState<PriceBreakdown | null>(null);
  const [summary, setSummary] = useState<CustomizationSummaryItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Load config when modal opens
  useEffect(() => {
    if (isOpen && product) {
      getConfig(product.category)
        .then((cfg) => {
          setConfig(cfg);
        })
        .catch((error) => {
          console.error('Error loading config:', error);
        });
    }
  }, [isOpen, product]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setCustomizations({});
      setPriceInfo(null);
      setSummary([]);
      setErrors([]);
      setConfig(null);
    }
  }, [isOpen]);

  // Update price when customizations change
  useEffect(() => {
    if (product && config) {
      const newPriceInfo = calculatePrice(product.price, customizations, config);
      setPriceInfo(newPriceInfo);

      const newSummary = formatSummary(customizations, config);
      setSummary(newSummary);
    }
  }, [product, config, customizations]);

  const getOptionValues = (optionId: string): CustomizationOptionValue[] => {
    const option = config?.options.find((o) => o.option_id === optionId);
    return option?.values || [];
  };

  const selectOption = (optionId: string, value: string, priceModifier: number) => {
    setCustomizations((prev) => ({
      ...prev,
      [optionId]: { value, price: priceModifier },
    }));
  };

  const selectLeafStyle = (value: string) => {
    const option = config?.options.find((o) => o.option_id === 'leaf_style');
    const optionValue = option?.values.find((v) => v.value === value);
    setCustomizations((prev) => ({
      ...prev,
      leaf_style: { value, price: optionValue?.price_modifier || 0 },
    }));
  };

  const selectBlendType = (value: string) => {
    const option = config?.options.find((o) => o.option_id === 'blend_type');
    const optionValue = option?.values.find((v) => v.value === value);
    setCustomizations((prev) => ({
      ...prev,
      blend_type: { value, price: optionValue?.price_modifier || 0 },
    }));
  };

  const getSelectedExtras = (): string[] => {
    const extras = customizations.extras?.value;
    return Array.isArray(extras) ? extras : [];
  };

  const isExtraSelected = (value: string): boolean => {
    return getSelectedExtras().includes(value);
  };

  const toggleExtra = (value: string, priceModifier: number) => {
    const selected = getSelectedExtras();

    if (selected.includes(value)) {
      const newSelected = selected.filter((v) => v !== value);
      setCustomizations((prev) => ({
        ...prev,
        extras: { value: newSelected, price: newSelected.length * priceModifier },
      }));
    } else if (selected.length < 3) {
      const newSelected = [...selected, value];
      setCustomizations((prev) => ({
        ...prev,
        extras: { value: newSelected, price: newSelected.length * priceModifier },
      }));
    }
  };

  const getGiftNotePrice = (): number => {
    const option = config?.options.find((o) => o.option_id === 'gift_note');
    return option?.validation_rules?.price || 0;
  };

  const getMaxGiftNoteLength = (): number => {
    const option = config?.options.find((o) => o.option_id === 'gift_note');
    return option?.validation_rules?.max_length || 100;
  };

  const updateGiftNote = (text: string) => {
    if (text) {
      setCustomizations((prev) => ({
        ...prev,
        gift_note: { value: text, price: getGiftNotePrice() },
      }));
    } else {
      setCustomizations((prev) => {
        const { gift_note: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const nextStep = () => {
    if (!config) return;

    const validation = validateStep(currentStep, customizations, config);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      completeCustomization();
    }
  };

  const completeCustomization = () => {
    if (!product || !priceInfo || !config) return;

    const customizedItem: CartItem = {
      ...product,
      id: generateCustomizationId(product.id),
      isCustomized: true,
      price: priceInfo.totalPrice,
      basePrice: product.price,
      customizationCost: priceInfo.customizationCost,
      customizations,
      customizationSummary: summary,
      quantity: 1,
    };

    onAddToCart(customizedItem);
  };

  const handleClose = () => {
    if (Object.keys(customizations).length > 0) {
      if (confirm('You have unsaved customizations. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="customization-overlay"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') handleClose();
        }}
        tabIndex={0}
        role="button"
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="customization-modal">
        <div className="customization-modal-content">
          {/* Header */}
          <div className="customization-header">
            <h2>Customize Your Tea</h2>
            <button className="close-customization" onClick={handleClose} aria-label="Close">
              &times;
            </button>
          </div>

          {/* Progress Stepper */}
          <div className="stepper-container">
            <div className="stepper-horizontal">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`stepper-step ${currentStep === step.number ? 'active' : ''} ${
                    currentStep > step.number ? 'completed' : ''
                  }`}
                >
                  <div className="step-circle">
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="step-label">{step.label}</div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div className="customization-body overflow-y-auto flex-1 p-8">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="error-summary">
                <h4>Please correct the following:</h4>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 1: Package Size */}
            {currentStep === 1 && config && (
              <div className="slide-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Package Size</h3>
                <p className="text-gray-600 mb-6">Choose your preferred quantity</p>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  role="radiogroup"
                  aria-label="Package size options"
                >
                  {getOptionValues('package_size').map((value) => (
                    <div
                      key={value.value}
                      className={`option-card ${
                        customizations.package_size?.value === value.value ? 'selected' : ''
                      }`}
                      onClick={() => selectOption('package_size', value.value, value.price_modifier)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectOption('package_size', value.value, value.price_modifier);
                        }
                      }}
                      tabIndex={0}
                      role="radio"
                      aria-checked={customizations.package_size?.value === value.value}
                    >
                      <div className="option-card-header">
                        <span className="option-name">{value.display_name}</span>
                        <span className={`option-price ${value.price_modifier === 0 ? 'free' : ''}`}>
                          {formatPriceModifier(value.price_modifier)}
                        </span>
                      </div>
                      {value.description && <p className="option-description">{value.description}</p>}
                      <div className="selected-indicator">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details (varies by category) */}
            {currentStep === 2 && config && (
              <div className="slide-in">
                {product.category === 'black' && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Brew Preferences</h3>
                    <p className="text-gray-600 mb-6">Select your strength and add-ons</p>

                    {/* Brew Strength */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="brew-strength-select">
                        Brew Strength *
                      </label>
                      <select
                        id="brew-strength-select"
                        className="form-select"
                        value={(customizations.brew_strength?.value as string) || ''}
                        onChange={(e) => selectOption('brew_strength', e.target.value, 0)}
                      >
                        <option value="">Select strength...</option>
                        {getOptionValues('brew_strength').map((value) => (
                          <option key={value.value} value={value.value}>
                            {value.display_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Add-ons */}
                    <div className="form-group">
                      <span className="form-label" id="add-ons-label">
                        Add-ons
                      </span>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                        role="radiogroup"
                        aria-labelledby="add-ons-label"
                      >
                        {getOptionValues('add_ons').map((value) => (
                          <div
                            key={value.value}
                            className={`option-card ${
                              customizations.add_ons?.value === value.value ? 'selected' : ''
                            }`}
                            onClick={() => selectOption('add_ons', value.value, value.price_modifier)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                selectOption('add_ons', value.value, value.price_modifier);
                              }
                            }}
                            tabIndex={0}
                            role="radio"
                            aria-checked={customizations.add_ons?.value === value.value}
                          >
                            <div className="option-card-header">
                              <span className="option-name">{value.display_name}</span>
                              <span
                                className={`option-price ${value.price_modifier === 0 ? 'free' : ''}`}
                              >
                                {formatPriceModifier(value.price_modifier)}
                              </span>
                            </div>
                            {value.description && (
                              <p className="option-description">{value.description}</p>
                            )}
                            <div className="selected-indicator">✓</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {product.category === 'green' && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Leaf Style & Accessories
                    </h3>
                    <p className="text-gray-600 mb-6">Customize your green tea experience</p>

                    <div className="form-group">
                      <label className="form-label" htmlFor="leaf-style-select">
                        Leaf Style *
                      </label>
                      <select
                        id="leaf-style-select"
                        className="form-select"
                        value={(customizations.leaf_style?.value as string) || ''}
                        onChange={(e) => selectLeafStyle(e.target.value)}
                      >
                        <option value="">Select style...</option>
                        {getOptionValues('leaf_style').map((value) => (
                          <option key={value.value} value={value.value}>
                            {value.display_name}
                            {value.price_modifier > 0 ? ` (+$${value.price_modifier})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <span className="form-label" id="accessories-label">
                        Accessories
                      </span>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        role="radiogroup"
                        aria-labelledby="accessories-label"
                      >
                        {getOptionValues('accessories').map((value) => (
                          <div
                            key={value.value}
                            className={`option-card ${
                              customizations.accessories?.value === value.value ? 'selected' : ''
                            }`}
                            onClick={() =>
                              selectOption('accessories', value.value, value.price_modifier)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                selectOption('accessories', value.value, value.price_modifier);
                              }
                            }}
                            tabIndex={0}
                            role="radio"
                            aria-checked={customizations.accessories?.value === value.value}
                          >
                            <div className="option-card-header">
                              <span className="option-name">{value.display_name}</span>
                              <span
                                className={`option-price ${value.price_modifier === 0 ? 'free' : ''}`}
                              >
                                {formatPriceModifier(value.price_modifier)}
                              </span>
                            </div>
                            <div className="selected-indicator">✓</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {product.category === 'oolong' && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Roast Level & Brewing</h3>
                    <p className="text-gray-600 mb-6">Select roast and optional brewing vessel</p>

                    <div className="form-group">
                      <label className="form-label" htmlFor="roast-level-select">
                        Roast Level *
                      </label>
                      <select
                        id="roast-level-select"
                        className="form-select"
                        value={(customizations.roast_level?.value as string) || ''}
                        onChange={(e) => selectOption('roast_level', e.target.value, 0)}
                      >
                        <option value="">Select roast...</option>
                        {getOptionValues('roast_level').map((value) => (
                          <option key={value.value} value={value.value}>
                            {value.display_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <span className="form-label" id="brewing-vessel-label">
                        Brewing Vessel
                      </span>
                      <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        role="radiogroup"
                        aria-labelledby="brewing-vessel-label"
                      >
                        {getOptionValues('brewing_vessel').map((value) => (
                          <div
                            key={value.value}
                            className={`option-card ${
                              customizations.brewing_vessel?.value === value.value ? 'selected' : ''
                            }`}
                            onClick={() =>
                              selectOption('brewing_vessel', value.value, value.price_modifier)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                selectOption('brewing_vessel', value.value, value.price_modifier);
                              }
                            }}
                            tabIndex={0}
                            role="radio"
                            aria-checked={customizations.brewing_vessel?.value === value.value}
                          >
                            <div className="option-card-header">
                              <span className="option-name">{value.display_name}</span>
                              <span
                                className={`option-price ${value.price_modifier === 0 ? 'free' : ''}`}
                              >
                                {formatPriceModifier(value.price_modifier)}
                              </span>
                            </div>
                            {value.description && (
                              <p className="option-description">{value.description}</p>
                            )}
                            <div className="selected-indicator">✓</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {product.category === 'herbal' && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Blend & Extras</h3>
                    <p className="text-gray-600 mb-6">Select blend and add extras (up to 3)</p>

                    <div className="form-group">
                      <label className="form-label" htmlFor="blend-type-select">
                        Blend Preference *
                      </label>
                      <select
                        id="blend-type-select"
                        className="form-select"
                        value={(customizations.blend_type?.value as string) || ''}
                        onChange={(e) => selectBlendType(e.target.value)}
                      >
                        <option value="">Select blend...</option>
                        {getOptionValues('blend_type').map((value) => (
                          <option key={value.value} value={value.value}>
                            {value.display_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <span className="form-label" id="extras-label">
                        Extras ({getSelectedExtras().length}/3)
                      </span>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                        role="group"
                        aria-labelledby="extras-label"
                      >
                        {getOptionValues('extras').map((value) => (
                          <div
                            key={value.value}
                            className={`option-card ${isExtraSelected(value.value) ? 'selected' : ''} ${
                              !isExtraSelected(value.value) && getSelectedExtras().length >= 3
                                ? 'opacity-50'
                                : ''
                            }`}
                            onClick={() => toggleExtra(value.value, value.price_modifier)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleExtra(value.value, value.price_modifier);
                              }
                            }}
                            tabIndex={0}
                            role="checkbox"
                            aria-checked={isExtraSelected(value.value)}
                          >
                            <div className="option-card-header">
                              <span className="option-name">{value.display_name}</span>
                              <span className="option-price">
                                {formatPriceModifier(value.price_modifier)}
                              </span>
                            </div>
                            <div className="selected-indicator">✓</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Gift Note */}
            {currentStep === 3 && config && (
              <div className="slide-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Gift Note</h3>
                <p className="text-gray-600 mb-2">Add a personal message to your order</p>
                <p className="text-sm text-gray-500 mb-6">Free with your order</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="gift-message-textarea">
                    Gift Message (Optional)
                  </label>
                  <textarea
                    id="gift-message-textarea"
                    className="form-input"
                    rows={4}
                    maxLength={getMaxGiftNoteLength()}
                    value={(customizations.gift_note?.value as string) || ''}
                    onChange={(e) => updateGiftNote(e.target.value)}
                    placeholder="Enter your message..."
                  />
                  <div className="flex justify-between mt-2">
                    <p className="form-help">Letters, numbers, and basic punctuation only</p>
                    <span className="text-sm text-gray-500">
                      {((customizations.gift_note?.value as string) || '').length}/
                      {getMaxGiftNoteLength()}
                    </span>
                  </div>
                </div>

                {customizations.gift_note?.value && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-2">Preview</p>
                    <p className="text-lg italic text-gold">"{customizations.gift_note.value}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Summary */}
            {currentStep === 4 && config && (
              <div className="slide-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Your Order</h3>
                <p className="text-gray-600 mb-6">
                  Please review your selections before adding to cart
                </p>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-lg mb-4">{product.name}</h4>
                  {summary.length > 0 ? (
                    <div className="space-y-3">
                      {summary.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <span className="font-semibold text-gray-700">{item.label}:</span>
                            <span className="text-gray-600 ml-2">{item.value}</span>
                          </div>
                          {item.price > 0 && (
                            <span className="text-gold font-semibold">
                              {formatPriceModifier(item.price)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No customizations selected</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="price-summary">
                  <h4 className="font-bold text-lg mb-4">Price Breakdown</h4>
                  {priceInfo?.breakdown.map((item, index) => (
                    <div key={index} className="price-breakdown-row">
                      <span>{item.label}</span>
                      <span>{formatPrice(item.amount)}</span>
                    </div>
                  ))}
                  {priceInfo && priceInfo.customizationCost > 0 && (
                    <div className="price-breakdown-row total">
                      <span>Total</span>
                      <span>{formatPrice(priceInfo.totalPrice)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="customization-footer">
            <div className="footer-left">
              {priceInfo && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Price</div>
                  <div className="text-2xl font-bold text-gold">
                    {formatPrice(priceInfo.totalPrice)}
                  </div>
                </div>
              )}
            </div>
            <div className="footer-right flex gap-4">
              <button
                className="btn btn-secondary"
                disabled={currentStep === 1}
                onClick={previousStep}
              >
                Previous
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                {currentStep === 4 ? 'Add to Cart' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

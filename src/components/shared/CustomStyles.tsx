import React from 'react';
import '../../index.css';

const CustomStyles = () => {
  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="txt-xl mb-large">Custom Styles Demo</h1>

      {/* Image Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Image Styles</h2>
        <img src="favicon.ico" alt="Small" className="img-small mb-small" />
        <img src="favicon.ico" alt="Medium" className="img-medium mb-small" />
        <img src="favicon.ico" alt="Large" className="img-large" />
      </div>

      {/* Padding Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Padding Styles</h2>
        <div className="p-small bg-gray-200 mb-small">Small Padding</div>
        <div className="p-medium bg-gray-200 mb-small">Medium Padding</div>
        <div className="p-large bg-gray-200">Large Padding</div>
      </div>

      {/* Margin Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Margin Styles</h2>
        <div className="m-small bg-gray-200 mb-small">Small Margin</div>
        <div className="m-medium bg-gray-200 mb-small">Medium Margin</div>
        <div className="m-large bg-gray-200">Large Margin</div>
      </div>

      {/* Text Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Text Styles</h2>
        <p className="txt-small mb-small">Small Text</p>
        <p className="txt-medium mb-small">Medium Text</p>
        <p className="txt-large mb-small">Large Text</p>
        <p className="txt-xl">Extra Large Text</p>
      </div>

      {/* Button Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Button Styles</h2>
        <div className="flex gap-4">
          <button className="btn-primary mb-small">Primary Button</button>
          <button className="btn-secondary mb-small">Secondary Button</button>
          <button className="btn-destructive">Destructive Button</button>
        </div>
      </div>

      {/* Input Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large mb-medium border-b-2">Input Styles</h2>
        <input type="text" className="input-bordered" placeholder="Bordered Input" />
        <input type="text" className="input-filled" placeholder="Filled Input" />
      </div>

      {/* Card Styles */}
      <div className="mb-large flex flex-col gap-2">
        <h2 className="txt-large border-b-2 mb-medium">Card Styles</h2>
        <div className="card-filled">Filled Card</div>
        <div className="card-bordered">Bordered Card</div>
      </div>
    </div>
  );
};

export default CustomStyles;

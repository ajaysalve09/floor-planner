const roomTypes = [
  { type: 'Hall'},
  { type: 'Bedroom'},
  { type: 'Kitchen'},
  { type: 'Bathroom'},
  { type: 'Dining Room'},
  { type: 'Study'},
  { type: 'Storage'},
  { type: 'Balcony'},
];

const roomCountInput = document.getElementById('roomCount');
const roomInputsContainer = document.getElementById('roomInputs');
const designForm = document.getElementById('designForm');
const errorEl = document.getElementById('error');
const output = document.getElementById('planOutput');

const plotWidthInput = document.getElementById('plotWidth');
const plotLengthInput = document.getElementById('plotLength');

// Clear error when typing in main inputs
[plotWidthInput, plotLengthInput, roomCountInput].forEach(input => {
  input.addEventListener('input', () => {
    errorEl.textContent = '';
    output.textContent = '';
  });
});

roomCountInput.addEventListener('input', () => {
  const count = parseInt(roomCountInput.value);
  if (isNaN(count) || count < 1 || count > 20) {
    roomInputsContainer.innerHTML = '';
    errorEl.textContent = '';
    return;
  }

  // Ensure wrapper exists
  let wrapper = document.getElementById('roomInputsWrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'roomInputsWrapper';
    roomInputsContainer.parentNode.insertBefore(wrapper, roomInputsContainer);
    wrapper.appendChild(roomInputsContainer);
  }

  // Clear old rooms
  roomInputsContainer.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room'); // <-- CSS handles styling

    const roomLabel = document.createElement('label');
    roomLabel.textContent = `Room ${i + 1}.`;

    const roomSelect = document.createElement('select');
    roomTypes.forEach(({ type }) => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      roomSelect.appendChild(option);
    });

    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.min = '0.1';
    widthInput.step = '0.1';
    widthInput.placeholder = 'Width';

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.min = '0.1';
    lengthInput.step = '0.1';
    lengthInput.placeholder = 'Length';

    // Clear error and output when editing
    [roomSelect, widthInput, lengthInput].forEach(input => {
      input.addEventListener('input', () => {
        errorEl.textContent = '';
        output.textContent = '';
        downloadBtn.style.display = 'none';
      });
    });

    roomDiv.append(roomLabel, roomSelect, widthInput, lengthInput);
    roomInputsContainer.appendChild(roomDiv);
  }
});

designForm.addEventListener('submit', e => {
  e.preventDefault();

  errorEl.textContent = '';
  output.textContent = '';

  const plotWidth = parseFloat(document.getElementById('plotWidth').value);
  const plotLength = parseFloat(document.getElementById('plotLength').value);
  const unit = document.getElementById('unit').value;
  const roomCount = parseInt(roomCountInput.value);

  if (isNaN(plotWidth) || isNaN(plotLength) || plotWidth <= 0 || plotLength <= 0) {
    errorEl.textContent = 'Please enter valid plot dimensions.';
    return;
  }
  if (isNaN(roomCount) || roomCount < 1 || roomCount > 20) {
    errorEl.textContent = 'Please enter a valid number of rooms (1-20).';
    return;
  }

  const rooms = [];
  for (let i = 0; i < roomCount; i++) {
    const inputs = roomInputsContainer.children[i].querySelectorAll('select, input');
    const type = inputs[0].value;
    const width = parseFloat(inputs[1].value);
    const length = parseFloat(inputs[2].value);

    if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
      errorEl.textContent = `Please enter valid dimensions for Room ${i + 1}.`;
      return;
    }
    if (width > plotWidth || length > plotLength) {
      errorEl.textContent = `Room ${i + 1} dimensions exceed plot size.`;
      return;
    }
    rooms.push({ type, width, length });
  }

  const totalArea = rooms.reduce((sum, r) => sum + r.width * r.length, 0);
  if (totalArea > plotWidth * plotLength) {
    errorEl.textContent = 'Total area of all rooms exceeds plot area.';
    return;
  }

// Generate plan text only
let planHTML = ` <h4>🏠 Details of Plan</h4>
   <h5>📏 Plot Size: ${plotWidth} x ${plotLength} ${unit} </h5>
    <table style="
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      text-align: center;">

      <thead style="background:#007bff; color:white; font-size: 14px;">
        <tr>
          <th style="padding:2px 4px;">No.</th>
          <th style="padding:2px 4px;">Type</th>
          <th style="padding:2px 4px;">Width</th>
          <th style="padding:2px 4px;">Length</th>
          <th style="padding:2px 4px;">Area (${unit}²)</th>
        </tr>
      </thead>
      <tbody>`

rooms.forEach((room, i) => {
  const area = (room.width * room.length).toFixed(2);
  planHTML += `
        <tr style="background:${i % 2 === 0 ? '#f5faff' : '#ffffff'}; font-size: 12px;">
          <td style="padding:2px 4px;">${i + 1}</td>
          <td style="padding:2px 4px;">${room.type}</td>
          <td style="padding:2px 4px;">${room.width}</td>
          <td style="padding:2px 4px;">${room.length}</td>
          <td style="padding:2px 4px; font-weight:500; color:#007acc;">${area}</td>
        </tr>`
});

planHTML += `
      </tbody>
    </table>
  <h5> ✅ Total Area: <span style="color:green;">${totalArea} ${unit}²</span> </h5>
  <h5> 📐 Remaining: <span style="color:orangered;">${(plotWidth * plotLength - totalArea).toFixed(2)} ${unit}²</span> </h5>
    `
output.innerHTML = planHTML;
});

const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
    designForm.reset();
    roomInputsContainer.innerHTML = '';
    errorEl.textContent = '';
    output.textContent = '';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackSection = document.getElementById('feedbackSection');
  const closeFeedback = document.getElementById('closeFeedback');
  const closeFeedbackTop = document.getElementById('closeFeedbackTop');
  // const closeFeedbackTop2 = document.getElementById('closeFeedbackTop2');
  const submitFeedback = document.getElementById('submitFeedback');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackError = document.getElementById('feedbackError');

  const feedbackFormContainer = document.getElementById('feedbackFormContainer');
  const thankYouContainer = document.getElementById('thankYouContainer');

  function resetFeedbackForm() {
    feedbackText.value = '';
    feedbackError.textContent = '';
    feedbackError.style.display = 'none';
    feedbackFormContainer.style.display = 'flex';
    thankYouContainer.style.display = 'none';
  }

  function closeModal() {
    resetFeedbackForm();
    feedbackSection.classList.remove('show');
    feedbackBtn.style.display = 'block';
    document.body.style.overflow = '';
  }

  feedbackBtn.addEventListener('click', () => {
    resetFeedbackForm();
    feedbackSection.classList.add('show');
    feedbackBtn.style.display = 'none';
    feedbackText.focus();
    document.body.style.overflow = 'hidden';
  });

  closeFeedback.addEventListener('click', closeModal);
  closeFeedbackTop.addEventListener('click', closeModal);
  // closeFeedbackTop2.addEventListener('click', closeModal);

  submitFeedback.addEventListener('click', () => {
    const feedback = feedbackText.value.trim();
    feedbackError.style.display = 'none';

    if (!feedback) {
      feedbackError.textContent = 'Please enter your feedback before submitting.';
      feedbackError.style.display = 'block';
      feedbackText.focus();
      return;
    }

    feedbackFormContainer.style.display = 'none';
    thankYouContainer.style.display = 'flex';
  });
});

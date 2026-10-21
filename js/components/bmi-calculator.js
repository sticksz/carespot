/* BMI calculator. BMI = weight(kg) / height(m)^2. Categories follow the common WHO bands.
   It is a general guide only, not a diagnosis. */
const BmiCalculator = {
  render() {
    return `
    <div class="bmi reveal">
      <h3>BMI Calculator</h3>
      <label for="bmi-weight">Weight (kg)</label>
      <input type="number" id="bmi-weight" min="1" placeholder="e.g. 70">
      <label for="bmi-height">Height (cm)</label>
      <input type="number" id="bmi-height" min="1" placeholder="e.g. 170">
      <button class="btn" id="bmi-btn" type="button">Calculate</button>
      <p class="bmi__result" id="bmi-result" role="status"></p>
      <small>General guide only, not a medical diagnosis.</small>
    </div>`;
  },
  init() {
    const { $ } = Utils;
    $('#bmi-btn').addEventListener('click', () => {
      const w = +$('#bmi-weight').value, h = +$('#bmi-height').value / 100, out = $('#bmi-result');
      if (!(w > 0) || !(h > 0)) { out.textContent = 'Enter a valid weight and height.'; return; }
      const bmi = w / (h * h);
      const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obese range';
      out.textContent = `BMI ${bmi.toFixed(1)}: ${cat}`;
    });
  }
};

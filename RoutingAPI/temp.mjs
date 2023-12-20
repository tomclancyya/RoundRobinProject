function interpolate(minOutput, maxOutput, minInput, maxInput, value) {
    return maxOutput - (minOutput + (maxOutput - minOutput) * ((value - minInput) / (maxInput - minInput)));
  }
  
  // Example usage
  const inputValues =  [0.1, 0.2, 1];

  const minOutput = 1;
  const maxOutput = 10;

  const minInput = 0.1;
  const maxInput = 1;
  
  for (const inputValue of inputValues) {
    const result = interpolate(minOutput, maxOutput, minInput, maxInput, inputValue);
    console.log(`For input ${inputValue}, interpolated result is: ${result}`);
  }
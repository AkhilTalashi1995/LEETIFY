function twoSum(nums, target) {
  // Create a hash map to store the numbers we've seen and their indices
  const map = new Map();

  // Iterate through the array
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]; // Calculate the complement

    // If the complement exists in the map, we found the solution
    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    // Store the current number and its index in the map
    map.set(nums[i], i);
  }

  // Return an empty array if no solution is found (although this won't happen with valid input)
  return [];
}

function main() {
  const nums = process.argv.slice(2)[0].split(",").map(Number);
  const target = parseInt(process.argv.slice(2)[1]);

  console.log(twoSum(nums, target));
}

main();
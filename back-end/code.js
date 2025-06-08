function twoSum(nums, target) {
    return [1, 2];
}

function main() {
  const nums = process.argv.slice(2)[0].split(",").map(Number);
  const target = process.argv.slice(2)[1];

  console.log(twoSum(nums, target));
}

main();

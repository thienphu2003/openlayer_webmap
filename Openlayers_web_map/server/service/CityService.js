const City = require("../model/City");

async function save(params) {
  const { ID } = params;
  try {
    if (ID) {
      const city = await City.findOne({
        where: {
          ID,
        },
      });
      if (city) {
        await city.update({
          last_time_click: Date.now(),
          total_click_count: city.total_click_count + 1,
        });
      }
      console.log("Total click count", city.total_click_count);
      return {
        total_click: city.total_click_count,
        last_time_click: city.last_time_click,
      };
    }
    return 0;
  } catch (err) {
    throw err;
  }
}

async function getData(params) {
  const { ID } = params;
  console.log(ID);
  const city = await City.findOne({
    where: {
      ID,
    },
  });
  return city.total_click_count;
}

module.exports = {
  save,
  getData,
};

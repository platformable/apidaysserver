require("dotenv").config();
const { google } = require("googleapis");
const sheets = google.sheets("v4");

let mainData = {};

async function authorize() {
  let authClient = await process.env.NEXT_PUBLIC_GOOGLE_KEY;
  if (authClient == null) {
    throw Error("authentication failed");
  }
  return authClient;
}

async function getClustersData(sheetId) {
  /* sheetValues.date = new Date(); */
  const authClient = await authorize();
  const request = await {
    spreadsheetId: sheetId,
    range: "Sheet2!A2:F",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets?.values?.get(request)).data;
    const allData = response.values;

    const cluster = new Set(
      allData.map((item, index) => {
        return item[2];
      })
    );

    /* lista de clusters */
    const newCluster = Array.from(cluster);

    newCluster.map((cluster, index) => {
      return (mainData[cluster] = { name: cluster });
    });

    const categories = newCluster.map((cluster, index) => {
      const data = allData.filter((element, index) => {
        return element[2] === cluster;
      });
      
      const categoryData = data.map((category, index) => {
        return category[1];
      });

      const subcategoriesData = data.map((subcategory, index) => {
        return subcategory[0];
      });
      
      const subcategoryByCategory = Array.from(new Set(subcategoriesData));
      
      const categoryByCluster = Array.from(new Set(categoryData)).map((category,index)=>{
        return {
            name:category,
            subcategory:subcategoryByCategory
        }
      })

        mainData[cluster] = {
          ...mainData[cluster],
          categories: categoryByCluster,

        };
    });
    
  // console.log("mainData",mainData)
  
    return mainData;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getClustersData,
};

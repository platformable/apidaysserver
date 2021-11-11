const express = require('express')
const app = express()
require('dotenv').config()
app.listen(process.env.PORT || 5000)

const { google } = require("googleapis");
const sheets = google.sheets("v4");


const sheetValues = {
  date:"",
  values:[],
  categories:[]
};

async function main() {

  sheetValues.date=new Date
  
  const authClient = await authorize();
  const request = await {
    spreadsheetId: process.env.NEXT_PUBLIC_SHEET_ID,
    range: "Sheet1!A2:BA",
    valueRenderOption: "FORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.get(request)).data;

    const allData =  response.values;
   allData.forEach((company, index) => {
      const item = {};
        item.id=index
        item.name=company[0]
        item.type=company[1] || null
        item.url=company[2] || null
        item.subcategory=company[3] || null
        item.parentCategorySlug=company[4] || null
        item.logo=company[5] 
        item.description=company[6] || null
        item.crunchbase=company[7] || null
        item.linkedin=company[8] || null
        item.twitter=company[9] || null
        item.github=company[10] || null
        item.developerPortal=company[11] || null
        item.yearFounded=company[12] || null
        item.numberOfFounders=company[13] || null
        item.founderNames=company[14] || null
        item.headquartersCountry=company[15] || null
        item.headquartersCity=company[16] || null
        item.womanInManagement=company[17] || null
        item.nonWhitePeopleInManagement=company[18] || null
        item.headcount=company[19] || null
        item.numberOfPositionsVacantInPastYear=company[20] || null
        item.estimatedRevenueRange=company[21] || null
        item.knownIndustriesWorkingIn=company[22] || null
        item.industryGroups=company[23] || null
        item.numbersOfCustomers=company[24] || null
        item.customers=company[25] || null
        item.totalNumberOfNewProducFeaturesInLastYear=company[26] || null
        item.totalProductsActive=company[27] || null
        item.patentsGranted=company[28] || null
        item.acquisitions=company[29] || null
        item.numberOfAccreditationsEarned=company[30]
        item.securityIssues=company[31] || null
        item.privacySpecificFeaturesIncluded=company[32] || null
        item.privacyBreaches=company[33] || null
        item.knownPartnershipsApi=company[34] || null
        item.knownPartnershipsNonApi=company[35] || null
        item.monthlyWebsiteVisits=company[36] || null
        item.monthlyWebsiteVisitsGrowth=company[37] || null
        item.participationInApidays=company[38] || null
        item.activeTechCount=company[39] || null
        item.itSpend=company[40] || null
        item.stage=company[41] || null
        item.totalFunding=company[42] || null
        item.lastFundingDate=company[43] || null
        item.top5Investors=company[44] || null
        item.numberLeadOfLeadInvestors=company[45] || null
        item.numberOfInvestors=company[46] || null
        item.acquiredBy=company[47] || null
        item.acquisitionPrice=company[48] || null
        item.acquisitionType=company[49] || null
        item.ipoDate=company[50] || null
        item.moneyRaisedAtIpo=company[51] || null
        item.valuationAtIpo=company[52] || null
        item.logoApiIndustry=company[53] || null
        item.pricingModel=company[54] || null
        item.pricingPage=company[55] || null
        item.blogQ12021=company[56] || 0
        item.blogQ22021=company[57] || 0
        item.blogQ32021=company[58] || 0
        item.blogQ42021=company[59] || 0
        item.apidays2018=company[60] || null
        item.apidays2019=company[61] || null
        item.apidays2020=company[62] || null
        item.apidays2021=company[63] || null

      sheetValues.values.push(item);
    
    })
  } catch (err) {
    console.error(err);
  }

}

main()


async function authorize() {
  let authClient = await process.env.NEXT_PUBLIC_GOOGLE_KEY;
  if (authClient == null) {
    throw Error("authentication failed");
  }
  return authClient;
}

var reFetch = function(req, res, next) {
  main()
  next(); 
}

app.use(reFetch)

app.get('/', function (req, res) {

  res.send(sheetValues)

 })
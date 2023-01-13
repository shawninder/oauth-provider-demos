import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { enums, GoogleAdsApi } from "google-ads-api";

const googleAdsAPIClient = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_DEV_TOKEN || '',
});

export const googleRouter = createTRPCRouter({
  listAvailableAdsCustomers: protectedProcedure.query(async ({ ctx }) => {
    return googleAdsAPIClient.listAccessibleCustomers(ctx.session.accessToken || '');
  }),

  getAdsCampaignsForCustomer: protectedProcedure
    .input(
      z.string()
    ).query(async ({ input: customer_id, ctx }) => {
      try {
        const customer = googleAdsAPIClient.Customer({
          customer_id,
          refresh_token: ctx.session.accessToken || '',
        });

        console.log('customer', customer)

        const campaigns = await customer.reportCount({
          entity: "campaign",
          attributes: [
            "campaign.id",
            "campaign.name",
            "campaign.bidding_strategy_type",
            "campaign_budget.amount_micros",
          ],
          metrics: [
            "metrics.cost_micros",
            "metrics.clicks",
            "metrics.impressions",
            "metrics.all_conversions",
          ],
          constraints: {
            "campaign.status": enums.CampaignStatus.ENABLED,
          },
          limit: 20,
        });

        return campaigns
      } catch (ex) {
        return ex
      }
  }),
});

// function getRefreshToken (token: JWT | undefined) {
//   return get({
//     hostname: 'www.googleapis.com',
//     port: 443,
//     path: '/oauth2/v3/token',
//     method: 'GET',
//     headers: {
//       'grant_type': 'refresh_token',
//       'client_id': process.env.GOOGLE_CLIENT_ID,
//       'client_secret': process.env.GOOGLE_CLIENT_SECRET,
//       'refresh_token': token?.toString()
//     }
//   })
// }

// function get (options: RequestOptions) {
//   return new Promise((resolve, reject) => {
//     const request = https.request(options, (res) => {
//       let responseStr = '';
//       res.on('error', reject);
//       res.on('data', (chunk: string) => {
//         responseStr += chunk;
//       })
//       res.on('end', () => {
//         if (res.statusCode !== 200) {
//           reject(res.statusCode);
//         } else {
//           resolve(responseStr);
//         }
//       })
//     })
//     request.on('error', reject);
//     request.end();
//   })
// }
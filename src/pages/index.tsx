import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const { status: sessionStatus, data: sessionData } = useSession();

  const { data: availableAdsCustomers } = api.google.listAvailableAdsCustomers.useQuery(
    undefined, // no input
    { enabled: sessionStatus === 'authenticated'},
  );

  const [customerIdx, setCustomerIdx] = useState(-1);
  const customerId = (availableAdsCustomers?.resource_names[customerIdx] || '')?.replace('customers/', '')

  const { data: adsCampaigns } = api.google.getAdsCampaignsForCustomer.useQuery(
    customerId,
    { enabled: sessionStatus === 'authenticated' && customerIdx !== null }
  );

  return (
    <>
      <Head>
        <title>Integrating with Providers</title>
        <meta name="description" content="Operating various APIs on behalf of your users via OAuth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
          Integrating with <span className={styles.pinkSpan}>Providers</span>
          </h1>
          <h2>Google Ads</h2>
          <ol className={styles.cardRow}>
            <li className={[styles.card, styles.loginContainer].join(' ')}>
              <h3 className={styles.cardTitle}>Step 1: Login</h3>
              <div className={styles.authContainer}>
                <p className={styles.showcaseText}>
                  {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                </p>
                <button
                  className={styles.loginButton}
                  onClick={sessionData ? () => void signOut() : () => void signIn('google')}
                >
                  {sessionData ? "Sign out" : "Sign in with Google"}
                </button>
              </div>
            </li>
            <li className={styles.card}>
              <h3 className={styles.cardTitle}>→ Session ({sessionStatus})</h3>
              <pre className={styles.cardText}>{JSON.stringify(sessionData, null, 2)}</pre>
            </li>
            <li className={styles.card}>
              <h3 className={styles.cardTitle}>Step 2: Select customer</h3>
              <ul>
                {availableAdsCustomers?.resource_names.map((fullId, idx) => {
                  return (
                    <li key={fullId}>
                      <a className={styles.link} onClick={() => {
                        idx === customerIdx ? setCustomerIdx(-1) : setCustomerIdx(idx)
                      }}>{fullId}</a>
                    </li>
                  )
                })}
              </ul>
            </li>
            {customerIdx === -1 ? null : (
              <li className={styles.card}>
                <h3 className={styles.cardTitle}>Report for customer #{customerId}</h3>
                <pre className={styles.cardText}>{JSON.stringify(adsCampaigns, null, 2)}</pre>
              </li>
            )}
          </ol>
        </div>
      </main>
    </>
  );
};

export default Home;

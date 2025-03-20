import NextAuth, { NextAuthOptions } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prismaClient),
  // events: {
  //   createUser: async ({ user }) => {
  //     const prismaUser = await getUserWithCollectivites(user.id);
  //     if (prismaUser) {
  //       const agentConnectInfo =
  //         prismaUser.agentconnect_info as AgentConnectInfo;
  //       const siret = agentConnectInfo.siret;
  //       if (siret) {
  //         const entityFromSiren = await fetchEntrepriseFromSirenApi(siret);
  //         const codeInsee =
  //           entityFromSiren?.etablissement?.adresseEtablissement
  //             .codeCommuneEtablissement;
  //         const codePostal =
  //           entityFromSiren?.etablissement?.adresseEtablissement
  //             .codePostalEtablissement;
  //         if (entityFromSiren?.etablissement) {
  //           await updateUserEtablissementInfo(
  //             user.id,
  //             entityFromSiren.etablissement?.uniteLegale
  //               ?.denominationUniteLegale,
  //             entityFromSiren.etablissement
  //           );
  //         }
  //         if (codePostal && codeInsee) {
  //           const entitiesFromBan = await fetchCollectiviteFromBanApi(
  //             codePostal
  //           );
  //           const collectiviteToUse = entitiesFromBan.find(
  //             (address) =>
  //               address.codeInsee === codeInsee &&
  //               address.codePostal === codePostal
  //           );
  //           if (collectiviteToUse) {
  //             const collectivite = await getOrCreateCollectivite(
  //               collectiviteToUse,
  //               prismaUser.id
  //             );
  //             await attachUserToCollectivite(prismaUser, collectivite, true);
  //           }
  //         }
  //       }
  //       await attachInvitationsByEmail(prismaUser.email, user.id);
  //       const emailService = new EmailService();
  //       await emailService.sendWelcomeMessageEmail({
  //         email: prismaUser.email,
  //         nom: prismaUser.nom ?? "",
  //       });
  //     }
  //   },
  // },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    signOut: "/deconnexion",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.id_token = account.id_token;
        token.provider = account.provider;
        token.user_id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // session.user.id = token.user_id;
      return {
        ...session,
        id_token: token.id_token,
        provider: token.provider,
        user_id: token.user_id,
      };
    },
  },
  providers: [
    {
      id: "proconnect",
      name: "Pro Connect",
      type: "oauth",
      idToken: true,
      clientId: process.env.PRO_CONNECT_ID,
      clientSecret: process.env.PRO_CONNECT_SECRET,
      wellKnown:
        process.env.PRO_CONNECT_BASE_URL +
        "/v2/.well-known/openid-configuration",
      allowDangerousEmailAccountLinking: true,
      checks: ["nonce", "state"],
      authorization: {
        params: {
          scope: "openid uid given_name usual_name email siret",
          acr_values: "eidas1",
          redirect_uri: process.env.NEXT_URL + "/api/auth/callback/proconnect",
          nonce: uuidv4(),
          state: uuidv4(),
        },
      },
      client: {
        authorization_signed_response_alg: "RS256",
        id_token_signed_response_alg: "RS256",
        userinfo_encrypted_response_alg: "RS256",
        userinfo_signed_response_alg: "RS256",
        userinfo_encrypted_response_enc: "RS256",
      },
      userinfo: {
        async request(context) {
          try {
            const userInfo = await fetch(
              process.env.PRO_CONNECT_BASE_URL + "/v2/userinfo",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${context.tokens.access_token}`,
                },
              }
            ).then((res) => {
              return res.text();
            });
            return JSON.parse(
              Buffer.from(userInfo.split(".")[1], "base64").toString()
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw new Error(error);
          }
        },
      },
      profile: async (profile) => {
        return {
          id: profile.email,
          prenom: profile.given_name,
          nom: profile.usual_name,
          email: profile.email,
          poste: profile.belonging_population,
          proconnect_info: profile,
        };
      },
    },
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

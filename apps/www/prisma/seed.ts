import crypto from 'crypto';

import {prisma} from '~/db.server';

/**
 * The main function that seeds the database with a sample project.
 *
 * It generates a new RSA key pair and stores the public and private keys,
 * along with predefined project details, in the database.
 *
 * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
 */
async function main(): Promise<void> {
  // Generate a new RSA key pair with a modulus length of 2048 bits
  const keys = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  /**
   * Export the public key in PEM format, using SPKI encoding.
   * @type {string}
   */
  const publicKey: string = keys.publicKey.export({
    type: 'spki',
    format: 'pem',
  }) as string;

  /**
   * Export the private key in PEM format, using PKCS8 encoding.
   * @type {string}
   */
  const privateKey: string = keys.privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  }) as string;

  /**
   * Insert a sample project into the database.
   *
   * @see {@link prisma.project.create} for details on how Prisma handles data insertion.
   */
  const project = await prisma.project.create({
    data: {
      id: 'cm38wkhur0000yseh1beq2hpx', // Predefined project ID
      readKey: 'read-e60c6f42-c506-4190-9252-692ce4ad9a38', // Read API key
      writeKey: 'write-2b05d863-6100-458b-b527-bc5a9d0b2061', // Write API key
      publicKey, // RSA public key
      privateKey, // RSA private key
    },
  });

  const items = Array.from({length: 10}, (_, index) => ({
    id: `chunk-${index + 1}`,
    projectId: 'cm38wkhur0000yseh1beq2hpx',
    data: `"use strict";var React=require("react"),ReactNative=require("react-native");function CustomComponent${index + 1}({label,onPress,style}){return React.createElement(ReactNative.TouchableOpacity,{onPress,onPress,style:[styles.button,style]},React.createElement(ReactNative.Text,{style:styles.label},label));}const styles=ReactNative.StyleSheet.create({button:{backgroundColor:"#007BFF",borderRadius:8,padding:10},label:{color:"#FFF",fontSize:16,textAlign:"center"}});module.exports=CustomComponent${index + 1};`,
  }));

  for (const i of items) {
    await prisma.chunk.create({
      data: {
        id: i.id,
        projectId: i.projectId,
        data: i.data,
      },
    });
  }

  // Log the seeded project's ID for confirmation
  console.log(`Seeded ${project.id} project`);
}

// Execute the main function and handle errors gracefully
main().catch(e => {
  console.error(e);
  process.exit(1);
});

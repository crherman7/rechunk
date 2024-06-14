package com.rechunk

import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.KeyFactory
import java.security.MessageDigest
import java.security.PublicKey
import java.security.Signature
import java.security.spec.X509EncodedKeySpec

class ReChunkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ReChunk"
    }

    override fun getName(): String {
        return NAME
    }

    // ReactMethod to verify data with a digital signature
    @ReactMethod
    fun verify(data: String, hash: String, signature: String, publicKeyStr: String, promise: Promise) {
        val publicKey = loadPublicKey(publicKeyStr)
        val isDataVerified = verifySignature(data, hash, signature, publicKey)

        if (isDataVerified && hashString(data) == hash) {
            promise.resolve(Base64.decode(data, Base64.DEFAULT).toString(Charsets.UTF_8))
        } else {
            promise.reject("[ReChunk]: ", "Unable to verify data")
        }
    }

    // Load public key from a string
    private fun loadPublicKey(publicKeyStr: String): PublicKey {
        val publicKeyPEM = publicKeyStr
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replace("\n", "")

        val encoded: ByteArray = Base64.decode(publicKeyPEM, Base64.DEFAULT)
        val keySpec = X509EncodedKeySpec(encoded)

        return KeyFactory.getInstance("RSA").generatePublic(keySpec)
    }

    // Verify data with a digital signature
    private fun verifySignature(data: String, hash: String, signature: String, publicKey: PublicKey): Boolean {
        val publicSignature = Signature.getInstance("SHA256withRSA")
        publicSignature.initVerify(publicKey)
        publicSignature.update(hash.toByteArray())

        val signatureBytes: ByteArray = Base64.decode(signature, Base64.DEFAULT)

        return publicSignature.verify(signatureBytes)
    }

    // Hash a string using SHA-256
    private fun hashString(input: String): String {
        return MessageDigest.getInstance("SHA-256")
            .digest(input.toByteArray())
            .joinToString("") { "%02x".format(it) }
    }
}

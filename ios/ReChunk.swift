import Foundation
import Security
import CryptoKit

@available(iOS 13.0, *)
@objc(ReChunk)
public class ReChunk: NSObject {

    private static func getPublicKey() -> String? {
        // obtain public key embedded into the bundle from infoPlist under a key RepackPublicKey
        let bundle = Bundle.main
        let publicKey = bundle.object(forInfoDictionaryKey: "RechunkPublicKey") as? String

        return publicKey
    }
    
    // MARK: Verification
    
    @objc
    func verify(_ data: String, hash: String, signature: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        guard let publicKeyStr = getPublicKey() else {
            reject("InvalidInput", "Cannot find Public Key", nil)
            return
        }

        guard let dataHash = hash.data(using: .utf8),
              let dataSignature = Data(base64Encoded: signature),
              let publicKey = loadPublicKey(from: publicKeyStr)
        else {
            reject("InvalidInput", "Invalid input data", nil)
            return
        }
        
        guard verifySignature(data: dataHash, signature: dataSignature, publicKey: publicKey) else {
            reject("VerificationFailed", "Signature verification failed", nil)
            return
        }
        
        if let inputData = data.data(using: .utf8),
           SHA256.hash(data: inputData).map({ String(format: "%02hhx", $0) }).joined().elementsEqual(hash),
           let decoded = base64DecodeString(encodedString: data) {
            resolve(decoded)
        } else {
            reject("VerificationFailed", "Verification process failed", nil)
        }
    }
    
    // MARK: Helper Methods
    
    private func base64DecodeString(encodedString: String) -> String? {
        guard let data = Data(base64Encoded: encodedString),
              let decodedString = String(data: data, encoding: .utf8)
        else {
            return nil
        }
        return decodedString
    }
    
    private func verifySignature(data: Data, signature: Data, publicKey: SecKey) -> Bool {
        var error: Unmanaged<CFError>?
        let algorithm = SecKeyAlgorithm.rsaSignatureMessagePKCS1v15SHA256
        
        return SecKeyVerifySignature(publicKey, algorithm, data as CFData, signature as CFData, &error)
    }
    
    private func loadPublicKey(from pkcs1PublicKeyString: String) -> SecKey? {
        let pemKey = pkcs1PublicKeyString
            .replacingOccurrences(of: "-----BEGIN PUBLIC KEY-----", with: "")
            .replacingOccurrences(of: "-----END PUBLIC KEY-----", with: "")
            .replacingOccurrences(of: "\n", with: "")
        
        let keyDict: [CFString: Any] = [
            kSecAttrKeyType: kSecAttrKeyTypeRSA,
            kSecAttrKeyClass: kSecAttrKeyClassPublic,
            kSecAttrKeySizeInBits: 2048,
            kSecReturnPersistentRef: true
        ]
        
        var error: Unmanaged<CFError>?
        guard let publicKey = SecKeyCreateWithData(Data(base64Encoded: pemKey)! as CFData, keyDict as CFDictionary, &error) else {
            if let error = error?.takeRetainedValue() {
                print("Error creating public key: \(error)")
            }
            return nil
        }
        
        return publicKey
    }
}

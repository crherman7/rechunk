#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReChunk, NSObject)

RCT_EXTERN_METHOD(verify:(NSString *)data
                  hash:(NSString *)hash
                  signature:(NSString *)signature
                  publicKeyStr:(NSString *)publicKeyStr
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

/**
 * Tool Services Index
 * Central export for all OSINT tool services
 */

export { default as breachDatabaseService } from './breachDatabaseService';
export { default as dataMiningService } from './dataMiningService';
export { default as dnsRecordsService } from './dnsRecordsService';
export { default as domainAnalysisService } from './domainAnalysisService';
// emailForensicsService removed — replaced by EmailIntelTool (uses /api/tools/email/analyze directly)
export { default as geolocationService } from './geolocationService';
export { default as hashAnalyzerService } from './hashAnalyzerService';
export { default as ipIntelligenceService } from './ipIntelligenceService';
export { default as phoneLookupService } from './phoneLookupService';
export { default as socialProfilerService } from './socialProfilerService';
export { default as urlScannerService } from './urlScannerService';

// New tool services
export { default as whatsappTraceService } from './whatsappTraceService';
export { default as faceRecognitionService } from './faceRecognitionService';
export { default as vehicleInfoService } from './vehicleInfoService';
export { default as upiInfoService } from './upiInfoService';


// Named exports for convenience
export {
  breachDatabaseService as breachDatabase,
  dataMiningService as dataMining,
  dnsRecordsService as dnsRecords,
  domainAnalysisService as domainAnalysis,
  // emailForensicsService removed
  geolocationService as geolocation,
  hashAnalyzerService as hashAnalyzer,
  ipIntelligenceService as ipIntelligence,
  phoneLookupService as phoneLookup,
  socialProfilerService as socialProfiler,
  urlScannerService as urlScanner,
  whatsappTraceService as whatsappTrace,
  faceRecognitionService as faceRecognition,
  vehicleInfoService as vehicleInfo,
  upiInfoService as upiInfo,

};

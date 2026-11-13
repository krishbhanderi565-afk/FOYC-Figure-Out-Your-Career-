export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'healthy',
    product: 'FOYC (Figure Out Your Career)',
    version: '1.0.0',
    deployment: 'vercel-production',
    targetProjectId: 'rlrzdvebvbtegxixyfrb',
    timestamp: new Date().toISOString(),
  });
}

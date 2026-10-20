import { Request, Response, NextFunction } from 'express';
import { createCompanyService, listCompaniesService } from '../services/companyService.js';

export async function createCompanyController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    const company = await createCompanyService(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'Empresa cadastrada com sucesso!',
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

export async function listCompaniesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    const companies = await listCompaniesService(req.user);

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
}

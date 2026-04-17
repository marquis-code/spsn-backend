import type { Response } from 'express';
import { AppointmentsService } from './appointments.service';
import { ExcelService } from '../excel/excel.service';
export declare class AppointmentsController {
    private readonly appointmentsService;
    private readonly excelService;
    constructor(appointmentsService: AppointmentsService, excelService: ExcelService);
    getTemplate(res: Response): Promise<void>;
    import(file: Express.Multer.File): Promise<any>;
    export(res: Response): Promise<void>;
    create(createAppointmentDto: any): Promise<import("./schemas/appointment.schema").AppointmentDocument>;
    findAll(): Promise<import("./schemas/appointment.schema").AppointmentDocument[]>;
    findOne(id: string): Promise<import("./schemas/appointment.schema").AppointmentDocument>;
    update(id: string, updateAppointmentDto: any): Promise<import("./schemas/appointment.schema").AppointmentDocument>;
    remove(id: string): Promise<any>;
}

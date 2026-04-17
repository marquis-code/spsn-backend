import { Model } from 'mongoose';
import { AppointmentDocument } from './schemas/appointment.schema';
export declare class AppointmentsService {
    private appointmentModel;
    constructor(appointmentModel: Model<AppointmentDocument>);
    create(createAppointmentDto: any): Promise<AppointmentDocument>;
    findAll(): Promise<AppointmentDocument[]>;
    findOne(id: string): Promise<AppointmentDocument>;
    update(id: string, updateAppointmentDto: any): Promise<AppointmentDocument>;
    delete(id: string): Promise<any>;
    bulkUpsert(data: any[]): Promise<any>;
    findAllExport(): Promise<any[]>;
}

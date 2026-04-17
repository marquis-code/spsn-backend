import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createAppointmentDto: any): Promise<AppointmentDocument> {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findAll(): Promise<AppointmentDocument[]> {
    return this.appointmentModel.find().populate('member').sort({ date: 1, time: 1 }).lean().exec() as any;
  }

  async findOne(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findById(id).populate('member').lean().exec();
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment as any;
  }

  async update(id: string, updateAppointmentDto: any): Promise<AppointmentDocument> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();
    if (!updatedAppointment) throw new NotFoundException('Appointment not found');
    return updatedAppointment;
  }

  async delete(id: string): Promise<any> {
    const result = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Appointment not found');
    return result;
  }

  async bulkUpsert(data: any[]): Promise<any> {
    const ops = data.map(item => ({
      updateOne: {
        filter: { member: item.member, date: item.date, time: item.time },
        update: { $set: item },
        upsert: true,
      },
    }));
    return this.appointmentModel.bulkWrite(ops);
  }

  async findAllExport(): Promise<any[]> {
    return this.appointmentModel.find().populate('member', 'fullName email').lean().exec();
  }
}

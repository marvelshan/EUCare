import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientWithUserIdDto } from './dto';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createPatient(patientWithUserIdDto: PatientWithUserIdDto) {
    const { userId, name, identity, birthday, address } = patientWithUserIdDto;
    // Check if identity already exists
    const existingPatient = await this.prisma.patient.findUnique({
      where: { identity },
    });
    if (existingPatient) {
      throw new UnprocessableEntityException(
        'Patient with this identity already exists',
      );
    }
    // Create new patient
    const patients = await this.prisma.patient.create({
      data: {
        userId,
        name,
        identity,
        birthday,
        address,
      },
    });
    return patients;
  }

  async getPatients(userId: number) {
    return this.prisma.patient.findMany({
      where: {
        userId: userId,
      },
    });
  }
}

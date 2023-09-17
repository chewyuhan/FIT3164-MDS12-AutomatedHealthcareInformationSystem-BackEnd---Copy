import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignInDto, AuthSignUpDto } from 'src/auth/dto';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    )

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });
  
  describe('Auth', () => {
    const dto = {
      email: "JohnDoe@gmail.com",
      password: "johndoe",
      ic: "0123456789",
      firstName: "John",
      lastName: "Doe",
      dob: "1889-04-20",
      gender: "Male",
      nationality: "Malaysian",
      phoneNo: "0327806803",
      emergencyNo: "5552368",
      emergencyRemarks: "Tell my wife I love her very much",
      title: "Doctor",
      specialty: "Pediatric Care",
      adminCode: "admin",
    }

    describe('Sign Up', () => {
      it('should sign up doctor John', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it.todo('invalid input fails validation');
    });

    describe('Sign In', () => {
      it('should sign in as John', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(200)
          .stores('token', 'access_token');
      });

      it.todo('invalid input fails validation');
    });

  });

  describe('Employee', () => {
    it('should get John employee info', () => {
      return pactum
        .spec()
        .get('/employees/myinfo')
        .withHeaders({
          Authorization: 'Bearer $S{token}',
        })
        .expectStatus(200)
        .expectBodyContains('John') // John is currently signed in
        .stores('employeeId', 'employeeId');
    });
    
    it('should get all doctors', () => {
      return pactum
        .spec()
        .get('/employees/doctors')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .expectStatus(200)
        .expectJsonLength(1); // Only 1 doctor
    });
  });


  describe('Patient', () => {
    const dto = {
      ic: "123123123",
      firstName: "Jane",
      lastName: "Doe",
      dob: "2000-01-01",
      gender: "Female",
      nationality: "British",
      phoneNo: "34234346756",
      email: "JaneDoe@gmail.com",
      emergencyNo: "5552368",
      emergencyRemarks: "Delete my browser history",
    }

    describe('Add Patient', () => {
      it('should add patient Jane', () => {
        return pactum
          .spec()
          .post('/patients/')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.firstName)
          .stores('patientId', 'patientId'); // save Jane's patientId
      })

      it.todo('invalid input fails validation');
    });

    describe('Edit Patient Data', () => {
      it('should edit patient Jane data', () => {
        return pactum
          .spec()
          .patch('/patients/{patientId}')
          .withPathParams('patientId', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            dob: '1999-09-09',
            nationality: 'Malaysian',
          })
          .expectStatus(200)
          .expectBodyContains('1999-09-09')
          .expectBodyContains('Malaysian');
      })

      it.todo('invalid input fails validation');
    });

    describe('Get Patient Data', () => {
      it('should get all patients', () => {
        return pactum
        .spec()
        .get('/patients/all')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .expectStatus(200)
        .expectJsonLength(1); // Only 1 patient
      });
  
      it('should get Jane patient data by patientId', () => {
        return pactum
          .spec()
          .get('/patients/{patientId}') // Apply Jane's patientId
          .withPathParams('patientId', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200)
          .expectBodyContains('Jane');
      });
    });
  });

  describe('Appointment', () => {
    const date1: String = '2023-10-01' // only initialize date since id variables stored
    const date2: String = '2023-10-02' // alternative date for 2nd appointment
    const date3: String = '2023-10-03' // alternative date for edit
 
    describe('Add Appointment', () => {
      it('should add appointment', () => {
        return pactum
          .spec()
          .post('/appointments/')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            patientId: '$S{patientId}',   // Patient Jane
            employeeId: '$S{employeeId}', // Doctor John
            appointmentDateTime: date1,
          })
          .expectStatus(201)
          .expectBodyContains(date1)
          .stores('appointmentId1', 'appointmentId');
      });

      it('should add non-conflicting appointment with same patient and doctor', () => {
        return pactum
          .spec()
          .post('/appointments/')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            patientId: '$S{patientId}',   // Patient Jane
            employeeId: '$S{employeeId}', // Doctor John
            appointmentDateTime: date2,   // non-conflicting date
          })
          .expectStatus(201)
          .expectBodyContains(date2)
          .stores('appointmentId2', 'appointmentId');
      });

      it('should not add conflicting appointment', () => {
        return pactum
        .spec()
        .post('/appointments/')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .withBody({
          patientId: '$S{patientId}',   // Patient Jane
          employeeId: '$S{employeeId}', // Doctor John
          appointmentDateTime: date1,   // conflicting date
        })
        .expectStatus(403); // Should receive forbidden exception
      });

      it.todo('more conflicting appointment types');

      it.todo('invalid input fails validation');
    });

    describe('Edit Appointment Data', () => {
      it('should edit appointment', () => {
        return pactum
          .spec()
          .patch('/appointments/{appointmentId}')
          .withPathParams('appointmentId', '$S{appointmentId1}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            appointmentDateTime: date3, // edit date
          })
          .expectStatus(200)
          .expectBodyContains(date3);
      });

      it.todo('invalid input fails validation');
    });

    describe('Delete Appointment', () => {
      it('should delete existing appointment', () => {
        return pactum
          .spec()
          .delete('/appointments/{appointmentId}')
          .withPathParams('appointmentId', '$S{appointmentId2}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200);
      });

      it.todo('should not delete non-existing appointments');
    });

    describe('Get Appointment Data', () => {
      it('should get all appointments', () => {
        return pactum
        .spec()
        .get('/appointments/all')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .expectStatus(200)
        .expectJsonLength(1); // Only 1 appointment left
      });
  
      it('should get all appointmets of patient with patientId', () => {
        return pactum
          .spec()
          .get('/appointments/patient/{patientId}') // Apply Jane's patientId
          .withPathParams('patientId', '$S{patientId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200);
      });
  
      it('should get all appointments of employee with employeeId', () => {
        return pactum
          .spec()
          .get('/appointments/employee/{employeeId}') // Apply John's employeeId
          .withPathParams('employeeId', '$S{employeeId}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200);
      });
    });
  });

  describe('Diagnosis', () => {
    const icd1 = 'F10'; // only need icd, already stored appointmentId1
    const icd2 = 'F11'; // icd for 2nd diagnosis
    const icd3 = 'F12'; // alternate icd for edit

    describe('Add Diagnosis', () => {
      it('should add diagnosis', () => {
        return pactum
          .spec()
          .post('/diagnoses/')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            appointmentId: '$S{appointmentId1}', 
            icd: icd1,
          })
          .expectStatus(201)
          .expectBodyContains(icd1)
          .stores('diagnosisId1', 'diagnosisId');
      })

      it('should add diagnosis to same appointment', () => {
        return pactum
          .spec()
          .post('/diagnoses/')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .withBody({
            appointmentId: '$S{appointmentId1}', 
            icd: icd2,
          })
          .expectStatus(201)
          .expectBodyContains(icd2)
          .stores('diagnosisId2', 'diagnosisId');
      })

      it.todo('invalid input fails validation');
    });

    // describe('Edit Diagnosis Data', () => {
    //   it('should edit diagnosis', () => {
    //     return pactum
    //       .spec()
    //       .patch('/diagnoses/{diagnosisId}')
    //       .withPathParams('diagnosisId', '${diagnosisId2}')
    //       .withHeaders({
    //         Authorization: 'Bearer $S{token}'
    //       })
    //       .withBody({
    //         icd: icd3,
    //       })
    //       .expectStatus(200)
    //       .expectBodyContains(icd3)
    //       .inspect();
    //   });

    //   it.todo('invalid input fails validation');
    // });

    describe('Delete Diagnosis', () => {
      it('should edit diagnosis', () => {
        return pactum
          .spec()
          .delete('/diagnoses/{diagnosisId}')
          .withPathParams('diagnosisId', '$S{diagnosisId2}')
          .withHeaders({
            Authorization: 'Bearer $S{token}'
          })
          .expectStatus(200);
      });
    });

    describe('Get Diagnosis Data', () => {
      it('should get all diagnoses', () => {
        return pactum
        .spec()
        .get('/diagnoses/all')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .expectStatus(200)
        .expectJsonLength(1); // Only 1 diagnosis left
      });

      it ('should get all diagnoses of patient with patientId', () => {
        return pactum
        .spec()
        .get('/diagnoses/patient/{patientId}') // Apply Jane's patientId
        .withPathParams('patientId', '$S{patientId}')
        .withHeaders({
          Authorization: 'Bearer $S{token}'
        })
        .expectStatus(200);
      });
    });

  });

});

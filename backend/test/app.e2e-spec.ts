import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../src/users/schema/user.schema';
import * as cookieParser from 'cookie-parser';
import { ResponseTransformInterceptor } from '../src/common/interceptors/response-transform-interceptors.filter';
import { CustomExceptionFilter } from '../src/common/exceptions/http-custom-exception.filter';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let testUserId: string;
  let userToken: string;
  let testAdminUserId: string;
  let adminToken: string;
  let createdUserId: string;

  const adminData = {
    first_name: 'Admin',
    last_name: 'User',
    dni: 99999999,
    birthdate: '1985-01-01',
    is_developer: false,
    description: 'Administrator',
    work_area: 'Management',
    password: 'adminpassword',
    role: 'admin',
  }

  const regularUserData = {
    first_name: 'John',
    last_name: 'Doe',
    dni: 12345678,
    birthdate: '1990-01-01',
    is_developer: true,
    description: 'Software Engineer',
    work_area: 'Development',
    password: 'testpassword',
    role: 'user',
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configuración global similar a main.ts
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new CustomExceptionFilter());
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));

    // Crear ambos usuarios en paralelo
    const [createdUserResponse, createdAdminUserResponse] = await Promise.all([
      request(app.getHttpServer())
        .post('/api/users')
        .send(regularUserData)
        .expect(201),
      request(app.getHttpServer())
        .post('/api/users')
        .send(adminData)
        .expect(201),
    ]);

    testUserId = (createdUserResponse.body as any).data.user._id;
    testAdminUserId = (createdAdminUserResponse.body as any).data.user._id;

    const normalUser = await userModel.findById(testUserId)
    console.log("################# USUARIO NORMAL CREADO:", normalUser)

    const adminUser = await userModel.findById(testAdminUserId)
    console.log("################# USUARIO ADMIN CREADO:", adminUser)

    // Login de ambos usuarios en paralelo
    const [loginResponse, adminLoginResponse] = await Promise.all([
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ dni: regularUserData.dni, password: regularUserData.password })
        .expect(201),
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ dni: adminData.dni, password: adminData.password })
        .expect(201),
    ]);

    // Se extrae la cookie del usuario creado
    const userCookies = loginResponse.headers['set-cookie'];
    if (Array.isArray(userCookies)) {
      const userCookie = userCookies.find((cookie: string) => cookie.includes('usercookie'));
      if (userCookie) {
        userToken = userCookie.split(';')[0].split('=')[1];
      };
    };

    console.log('########## USER TOKEN:', userToken)

    // Se extrase la cookie del admin creado
    const adminCookies = adminLoginResponse.headers['set-cookie'];
    if (Array.isArray(adminCookies)) {
      const adminCookie = adminCookies.find((cookie: string) => cookie.includes('usercookie'));
      if (adminCookie) {
        adminToken = adminCookie.split(';')[0].split('=')[1];
      };
    };

    console.log('########## ADMIN TOKEN:', adminToken)
  });

  afterAll(async () => {
    await userModel.findOneAndDelete({ dni: adminData.dni })
    await app.close();
  });

  describe('POST /api/users/register', () => {
    it('should fail to register with invalid DNI', async () => {
      const invalidDniUser = { ...regularUserData, dni: 12345678 };
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(invalidDniUser)
        .expect(409);

      expect(response.body).toHaveProperty('category', 'register');
      expect(response.body.message).toContain('User DNI already exist');
    });

    // it('should fail to register with weak password', async () => {
    //   const weakPasswordUser = { ...regularUserData, password: 'weak' };
    //   const response = await request(app.getHttpServer())
    //     .post('/api/auth/register')
    //     .send(weakPasswordUser)
    //     .expect(400);

    //   expect(response.body).toHaveProperty('category', 'register');
    //   expect(response.body.message).toContain('password is not strong enough');
    // });
  });

  // Negative Login Tests
  describe('POST /api/auth/login', () => {
    it('should fail to login with incorrect password', async () => {
      const invalidLoginDto = { dni: regularUserData.dni, password: 'WrongPassword123!' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(invalidLoginDto)
        .expect(401);

      expect(response.body).toHaveProperty('category', 'login');
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail to login with non-existent DNI', async () => {
      const invalidLoginDto = { dni: 123456789, password: 'SomePassword123!' };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(invalidLoginDto)
        .expect(401);

      expect(response.body).toHaveProperty('category', 'login');
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/users', () => {
    it('should return an array of users for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Cookie', [`usercookie=${adminToken}`])
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('findAllUsers');
      expect(body.status).toBe('success');
      expect(body.data.users).toBeInstanceOf(Array);
      expect(body.data.users.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Cookie', [`usercookie=${userToken}`])
        .expect(403);

      const body = response.body as any;
      expect(body.status).toBe('error');
      expect(body.category).toBe('authorization');
      expect(body.message).toContain(`Access denied. You don't have permissions to do this`);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .expect(401);

      const body = response.body as any;
      expect(body.status).toBe('error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID for admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${testUserId}`)
        .set('Cookie', [`usercookie=${adminToken}`])
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('findUserById');
      expect(body.status).toBe('success');
      expect(body.data.user).toBeDefined();
      expect(body.data.user._id).toBe(testUserId);
    });

    it('should return 404 if user is not found', async () => {
      const nonExistentId = '65f000000000000000000000';
      const response = await request(app.getHttpServer())
        .get(`/api/users/${nonExistentId}`)
        .set('Cookie', [`usercookie=${adminToken}`])
        .expect(404);

      const body = response.body as any;
      expect(body.status).toBe('error');
      expect(body.category).toBe('findUserById');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        first_name: 'Jane',
        last_name: 'Doe',
        dni: 87654321,
        birthdate: '1995-05-15',
        is_developer: false,
        description: 'UI Designer',
        work_area: 'Design',
        password: 'securepassword',
        role: 'user',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      const body = response.body as any;

      const user = await userModel.findOne({ dni: body.data.user.dni });
      user && (createdUserId = user._id)

      // dniForCreatedUser = await userModel.findOne({ dni: body.data.user.dni })

      expect(body.category).toBe('createUser');
      expect(body.status).toBe('success');
      expect(body.data.user).toBeDefined();
      expect(body.data.user.dni).toBe(createUserDto.dni);
      expect(body.data.user.first_name).toBe(createUserDto.first_name);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update own user data', async () => {
      const updateDto = { description: 'Updated description' };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}`)
        .set('Cookie', [`usercookie=${userToken}`])
        .send(updateDto)
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('updateUserById');
      expect(body.status).toBe('success');
      expect(body.data.user.description).toBe(updateDto.description);
    });

    it('should allow admin to update any user', async () => {
      const updateDto = { first_name: 'Admin Updated' };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}`)
        .set('Cookie', [`usercookie=${adminToken}`])
        .send(updateDto)
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('updateUserById');
      expect(body.status).toBe('success');
      expect(body.data.user.first_name).toBe(updateDto.first_name);
    });

    it('should return 403 when updating other users as non-admin', async () => {
      const updateDto = { first_name: 'Unauthorized Update' };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/65f000000000000000000001`)
        .set('Cookie', [`usercookie=${userToken}`])
        .send(updateDto)
        .expect(403);

      const body = response.body as any;
      expect(body.status).toBe('error');
      expect(body.category).toBe('authorization');
      expect(body.message).toContain(`Access denied. You don't have permissions to do this`);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 403 when deleting other users as non-admin', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}`)
        .set('Cookie', [`usercookie=${userToken}`])
        .expect(403);

      const body = response.body as any;
      expect(body.status).toBe('error');
      expect(body.category).toBe('authorization');
      expect(body.message).toContain(`Access denied. You don't have permissions to do this`);
    });

    it('should allow admin to delete any user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}`)
        .set('Cookie', [`usercookie=${adminToken}`])
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('removeUserById');
      expect(body.status).toBe('success');
    });

    it('should delete own user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${testUserId}`)
        .set('Cookie', [`usercookie=${userToken}`])
        .expect(200);

      const body = response.body as any;
      expect(body.category).toBe('removeUserById');
      expect(body.status).toBe('success');
    });
  });
});

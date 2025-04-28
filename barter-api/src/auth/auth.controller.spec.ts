import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
    signout: jest.fn(),
    me: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      const dto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const avatar = {
        filename: 'avatar.png',
      } as Express.Multer.File;

      const newUser = { id: 1, ...dto, avatar: 'uploads/avatar.png' };

      mockAuthService.signup.mockResolvedValue(newUser);

      const result = await controller.signup(dto, avatar);

      expect(mockAuthService.signup).toHaveBeenCalledWith({
        ...dto,
        avatar: 'uploads/avatar.png',
      });

      expect(result).toEqual({
        message: 'User successfully registered',
        user: newUser,
      });
    });
  });

  describe('signin', () => {
    it('should call signin method', async () => {
      const dto: SigninDto = { email: 'test@example.com', password: 'password123' };
      const req = {}; // mock req
      const res = {}; // mock res

      mockAuthService.signin.mockResolvedValue('signed-in');

      const result = await controller.signin(dto, req, res);

      expect(mockAuthService.signin).toHaveBeenCalledWith(dto, req, res);
      expect(result).toEqual('signed-in');
    });
  });

  describe('signout', () => {
    it('should call signout method', async () => {
      const req = {}; // mock req
      const res = {}; // mock res

      mockAuthService.signout.mockResolvedValue('signed-out');

      const result = await controller.signout(req, res);

      expect(mockAuthService.signout).toHaveBeenCalledWith(req, res);
      expect(result).toEqual('signed-out');
    });
  });

  describe('me', () => {
    it('should return user info', async () => {
      const req = { user: { id: 1 } };

      mockAuthService.me.mockResolvedValue({ id: 1, email: 'test@example.com' });

      const result = await controller.me(req);

      expect(mockAuthService.me).toHaveBeenCalledWith(req);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });
  });
});


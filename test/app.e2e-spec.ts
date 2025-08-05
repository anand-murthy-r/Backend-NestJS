import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDtoSignIn, AuthDtoSignUp } from "../src/auth/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile(); 
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333); 

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDtoSignUp = {
      email: "anand@gmail.com",
      password: "123",
      firstName: "Anand",
      lastName: "Murthy"
    }
    describe("Signup", () => {

      it("should throw error if email empty", () => {
        const { email, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("Should sign up", () => {
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });
    
    describe("Signin", () => {
      it("Should sign in", () => {
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .withBody(dto)
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe("User", () => {
    describe("Get me", () => {});

    describe("Edit user", () => {});
  });

  describe("Bookmarks", () => {
    describe("Create bookmarks", () => {});
    
    describe("Get bookmarks", () => {});

    describe("Get bookmark by Id", () => {});

    describe("Edit bookmark", () => {});

    describe("Delete bookmark", () => {});
  });
});
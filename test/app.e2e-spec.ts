import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDtoSignIn, AuthDtoSignUp } from "../src/auth/dto";
import { EditUserDto } from "src/user/dto";

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

      it("should throw error if password empty", () => {
        const { password, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("should throw error if firstName empty", () => {
        const { firstName, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("should throw error if lastName empty", () => {
        const { lastName, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("should throw error if no body provided", () => {
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
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
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });

      it("should throw error if email empty", () => {
        const { email, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("should throw error if password empty", () => {
        const { password, ...theRest } = dto;
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .withBody(theRest)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("should throw error if no body provided", () => {
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      
      it("should throw error if email does not exist", () => {
        const new_dto = dto;
        new_dto.email = "doesnt_exist@nope.com";
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .withBody(new_dto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it("should throw error if password incorrect", () => {
        const new_dto = dto;
        new_dto.password = "something_wrong";
        return pactum
          .spec()
          .post("http://localhost:3333/auth/signin")
          .withBody(new_dto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe("User", () => {
    describe("Get me", () => {
      it("should get current user", () => {
        return pactum 
          .spec()
          .get("http://localhost:3333/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe("Edit user", () => {
      it("should edit user based on userId", () => {
        const new_dto = {
          id: 4,
          email: "newemail@newdomain.com",
          firstName: "new_firstName",
          lastName: "new_lastName"
        };
        return pactum
          .spec()
          .patch("http://localhost:3333/users")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .withBody(new_dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(new_dto.email)
          .expectBodyContains(new_dto.firstName)
          .expectBodyContains(new_dto.lastName);
      });
    });
  });

  describe("Bookmarks", () => {
    describe("Create bookmarks", () => {});
    
    describe("Get bookmarks", () => {});

    describe("Get bookmark by Id", () => {});

    describe("Edit bookmark", () => {});

    describe("Delete bookmark", () => {});
  });
});
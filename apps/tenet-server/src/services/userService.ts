import prisma from '../app/prisma';

export interface User {
  id: number;
  username: string;
  password: string;
  createAt: Date;
  updateAt: Date;
}

class UserService {
  // async updateUser(username: string) {
  //   prisma.user.findMany({
  //     where: {
  //       name: username
  //     }
  //   })
  // }
  // async insertUser(username: string, password: string) {
  //   prisma.user.create({
  //     data: {
  //     }
  //   })
  // }
  // async searchUser(username: string): Promise<User | undefined> {
  // }
}

export default new UserService();

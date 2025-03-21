import * as bcrypt from 'bcrypt';

// Se aplica el hasheo a la contraseña
export const createHash = (password: string): string => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Se comparan las contraseñas, retorna true o false según corresponda.
export const isValidPassword = (password: string, user: { password: string }): boolean => bcrypt.compareSync(password, user.password)
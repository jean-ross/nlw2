import { Request, Response } from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/converHoursToMinutes';

interface scheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'É necessário informar filtros para procurar aulas',
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function Exists() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return response.json(classes);
  }

  // Cria uma aula
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    // Inicia transação
    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds;

      const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from), // utilizando a função criada
          to: convertHourToMinutes(scheduleItem.to), // utilizando a função criada
        };
      });

      await trx('class_schedule').insert(classSchedule);

      // Efetiva a transação
      await trx.commit();

      // Mensagem de sucesso
      return response.status(201).json({
        success: 'Aula criada com sucesso',
      });
    } catch (e) {
      // Desfaz transação
      await trx.rollback();

      // Mensagem de erro
      return response.status(400).json({
        error: 'Erro ao criar aula',
      });
    }
  }
}

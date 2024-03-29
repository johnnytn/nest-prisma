import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Stock, STOCK_FIELDS } from 'src/commons/types/stock.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StockService {
  constructor(private readonly userService: UserService) {}
  private logger = new Logger(StockService.name);
  async getStocks(request, code: string) {
    try {
      const API_PATH = `http://localhost:3002/`;
      const { data } = await axios.get(`${API_PATH}stocks/${code}`);

      if (data) {
        const metadata = this.mapStockToDB(data);
        await this.userService.createHistory({
          userId: request.user.userId,
          symbol: data[STOCK_FIELDS.SYMBOL],
          metadata,
        });
        this.logger.log(
          `Stock "${data[STOCK_FIELDS.SYMBOL]}" has been added to user "${
            request.user.userId
          }" History`,
        );
      }
      // TODO: add to history table
      return this.mapStockToResponse(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private mapStockToResponse(stock: Stock) {
    const payload = {
      name: stock[STOCK_FIELDS.NAME],
      symbol: stock[STOCK_FIELDS.SYMBOL],
      open: stock[STOCK_FIELDS.OPEN] ? Number(stock[STOCK_FIELDS.OPEN]) : 0,
      high: stock[STOCK_FIELDS.HIGH] ? Number(stock[STOCK_FIELDS.HIGH]) : 0,
      low: stock[STOCK_FIELDS.LOW] ? Number(stock[STOCK_FIELDS.LOW]) : 0,
      close: stock[STOCK_FIELDS.CLOSE] ? Number(stock[STOCK_FIELDS.CLOSE]) : 0,
    };
    return payload;
  }

  private mapStockToDB(stock: Stock) {
    const payload = {
      date: stock[STOCK_FIELDS.DATE]
        ? new Date(stock[STOCK_FIELDS.DATE]).toJSON()
        : '',
      name: stock[STOCK_FIELDS.NAME],
      symbol: stock[STOCK_FIELDS.SYMBOL],
      open: stock[STOCK_FIELDS.OPEN],
      high: stock[STOCK_FIELDS.HIGH] ? Number(stock[STOCK_FIELDS.HIGH]) : 0,
      low: stock[STOCK_FIELDS.LOW] ? Number(stock[STOCK_FIELDS.LOW]) : 0,
      close: stock[STOCK_FIELDS.CLOSE],
    };

    return payload;
  }
}

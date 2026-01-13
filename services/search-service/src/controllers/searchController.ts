import { Request, Response } from "express";
import { SearchService } from "../services/searchService";

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const { city, startDate, endDate, guests } = req.query;

      if (!city || !startDate || !endDate || !guests) {
        return res.status(400).json({
          message: "Missing required query params",
        });
      }

      const isLoggedIn = req.headers["x-user-logged-in"] === "true";

      const results = await SearchService.searchAvailableRooms({
        city: city as string,
        startDate: startDate as string,
        endDate: endDate as string,
        guests: Number(guests),
        isLoggedIn,
      });

      res.json(results);
    } catch (err: any) {
      res.status(400).json({
        message: err.message || "Search failed",
      });
    }
  }
}

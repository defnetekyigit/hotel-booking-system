import { Request, Response } from "express";
import { SearchService } from "../services/searchService";
import { cache } from "../cache/simpleCache";

const TTL_MS = 60_000; // 1 dakika

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const { city, startDate, endDate, guests } = req.query;

      if (!city) {
        return res.status(400).json({
          message: "city query param is required",
        });
      }

      const isLoggedIn = req.headers["x-user-logged-in"] === "true";

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const cacheKey = JSON.stringify({
        city,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        guests: guests ?? null,
        isLoggedIn,
        page,
        limit,
      });

      const cached = cache.get<any>(cacheKey);
      if (cached) {
        return res.json({
          ...cached,
          cached: true,
        });
      }

      const result = await SearchService.search({
        city: city as string,
        guests: guests ? Number(guests) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        isLoggedIn,
        page,
        limit,
      });

      cache.set(cacheKey, result, TTL_MS);

      res.json({
        ...result,
        cached: false,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message || "Search failed",
      });
    }
  }
}

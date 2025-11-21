namespace OmniSightAPI.Helpers
{
    public static class FormattingHelpers
    {
        public static string FormatTimestamp(object timestamp)
        {
            if (timestamp is DateTime dt)
            {
                return dt.ToString("MMM dd, yyyy HH:mm");
            }
            if (timestamp != null)
            {
                if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
                {
                    return parsedDt.ToString("MMM dd, yyyy HH:mm");
                }
            }
            return "Unknown time";
        }

        public static string FormatActivityTimestamp(object timestamp)
        {
            if (timestamp is DateTime dt)
            {
                return dt.ToString("h:mm tt");
            }
            if (timestamp != null)
            {
                if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
                {
                    return parsedDt.ToString("h:mm tt");
                }
            }
            return "Unknown time";
        }

        public static string FormatLogTimestamp(object timestamp)
        {
            if (timestamp is DateTime dt)
            {
                return dt.ToString("yyyy-MM-dd HH:mm:ss");
            }
            if (timestamp != null)
            {
                if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
                {
                    return parsedDt.ToString("yyyy-MM-dd HH:mm:ss");
                }
            }
            return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public static string FormatDuration(object durationSeconds)
        {
            if (durationSeconds is int seconds)
            {
                return FormatDurationFromSeconds(seconds);
            }
            if (durationSeconds is long longSeconds)
            {
                return FormatDurationFromSeconds((int)longSeconds);
            }
            if (durationSeconds != null && int.TryParse(durationSeconds.ToString(), out int parsedSeconds))
            {
                return FormatDurationFromSeconds(parsedSeconds);
            }
            return "0s";
        }

        private static string FormatDurationFromSeconds(int seconds)
        {
            if (seconds < 60) return $"{seconds}s";
            if (seconds < 3600) return $"{seconds / 60}m {seconds % 60}s";
            return $"{seconds / 3600}h {(seconds % 3600) / 60}m";
        }
    }
}
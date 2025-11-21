namespace OmniSightAPI.Helpers
{
    public static class UserHelpers
    {
        public static object GetUserInfo(string userId, Dictionary<string, dynamic> userMap)
        {
            var defaultUser = new
            {
                name = "System",
                initials = "SY",
                color = "bg-gradient-to-br from-primary to-accent"
            };

            if (userId != null && userMap.ContainsKey(userId))
            {
                var user = userMap[userId];
                var firstName = user.first_name?.ToString() ?? "";
                var lastName = user.last_name?.ToString() ?? "";
                var email = user.email?.ToString() ?? "";

                return new
                {
                    name = $"{firstName} {lastName}".Trim() != "" ? $"{firstName} {lastName}".Trim() : email,
                    initials = GetInitials(firstName, lastName, email),
                    color = GetUserColor(email)
                };
            }

            return defaultUser;
        }

        private static string GetInitials(string firstName, string lastName, string email)
        {
            if (!string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName))
                return $"{firstName[0]}{lastName[0]}".ToUpper();

            if (!string.IsNullOrEmpty(firstName))
                return firstName.Length >= 2 ? firstName.Substring(0, 2).ToUpper() : firstName.ToUpper() + "X";

            if (!string.IsNullOrEmpty(email))
                return email.Substring(0, 2).ToUpper();

            return "US";
        }

        private static string GetUserColor(string email)
        {
            var colors = new[]
            {
                "bg-gradient-to-br from-blue-500 to-cyan-500",
                "bg-gradient-to-br from-purple-500 to-pink-500",
                "bg-gradient-to-br from-green-500 to-emerald-500",
                "bg-gradient-to-br from-orange-500 to-red-500",
                "bg-gradient-to-br from-primary to-accent"
            };

            var hash = email?.GetHashCode() ?? 0;
            return colors[Math.Abs(hash) % colors.Length];
        }
    }
}
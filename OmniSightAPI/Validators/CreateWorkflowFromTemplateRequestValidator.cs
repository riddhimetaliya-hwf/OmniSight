using FluentValidation;
using OmniSightAPI.Models;

namespace OmniSightAPI.Validators;

public class CreateWorkflowFromTemplateRequestValidator : AbstractValidator<CreateWorkflowFromTemplateRequest>
{
    public CreateWorkflowFromTemplateRequestValidator()
    {
        RuleFor(x => x.TemplateId)
            .NotEmpty()
            .WithMessage("Template ID is required")
            .MaximumLength(100)
            .WithMessage("Template ID must not exceed 100 characters");

        RuleFor(x => x.CustomName)
            .MaximumLength(200)
            .WithMessage("Custom name must not exceed 200 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.CustomName));

        RuleFor(x => x.ScheduledTime)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Scheduled time must be in the future")
            .When(x => x.ScheduledTime.HasValue);

        RuleFor(x => x.CronExpression)
            .NotEmpty()
            .WithMessage("Cron expression is required when schedule type is cron")
            .When(x => x.ScheduleType == "cron");
    }
}


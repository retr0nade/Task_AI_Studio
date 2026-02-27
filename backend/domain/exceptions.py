class DomainException(Exception):
    pass

class InvalidTransitionError(DomainException):
    pass

class MissingAcceptanceCriteriaError(DomainException):
    pass

class AIValidationException(DomainException):
    pass

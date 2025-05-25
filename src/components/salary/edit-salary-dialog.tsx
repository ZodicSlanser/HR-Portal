import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SalaryRecord } from "@/lib/types/salary-types";

interface EditSalaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: SalaryRecord | null;
  onSave: (recordId: string, data: { bonus: number; deduction: number }) => Promise<void>;
}

export function EditSalaryDialog({ isOpen, onClose, record, onSave }: EditSalaryDialogProps) {
  const [bonus, setBonus] = useState<string>("");
  const [deduction, setDeduction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);  // Update form values when record changes
  useEffect(() => {
    if (record) {
      setBonus(record.bonus.toString());
      setDeduction(record.deduction.toString());
    }
  }, [record]);

  const handleSave = async () => {
    if (!record) return;

    setIsLoading(true);
    try {
      await onSave(record.id, {
        bonus: parseFloat(bonus) || 0,
        deduction: parseFloat(deduction) || 0,
      });
      onClose();
    } catch (error) {
      console.error("Error saving salary record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setBonus("");
    setDeduction("");
    onClose();
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Salary Record</DialogTitle>
          <DialogDescription>
            Update bonus and deduction for {record.employee.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editBonus">Bonus</Label>
            <Input
              id="editBonus"
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="editDeduction">Deduction</Label>
            <Input
              id="editDeduction"
              type="number"
              value={deduction}
              onChange={(e) => setDeduction(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
